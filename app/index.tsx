import { generateSyncthingEnvironment, killSyncthing, spawnSyncthingWorker } from '@/utils/syncthing/SyncthingModule';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, NativeModules, StyleSheet, Text, View } from 'react-native';

// Get access to our native module
const { SyncthingModule } = NativeModules;

export default function Index() {
  const [status, setStatus] = useState('Not started');
  const [isRunning, setIsRunning] = useState(false);
  const [isApiChecked, setIsApiChecked] = useState(false);
  const [apiStatus, setApiStatus] = useState('Not checked');
  const router = useRouter();

  
  // Initialize Syncthing when component mounts
  useEffect(() => {
    const initialize = async () => {
      try {
        if (SyncthingModule) {
          console.log("Initializing Syncthing native module...");
        } else {
          setStatus('Native module not available');
        }
      } catch (error: any) {
        console.error('Error initializing Syncthing:', error);
        setStatus('Error initializing: ' + error.message);
      }
    };
    
    initialize();
  }, []);

  const startSyncthing = async () => {
    try {
      setStatus('Starting Syncthing...');
      spawnSyncthingWorker(SyncthingModule, generateSyncthingEnvironment())
      setIsRunning(true);
    } catch (error :any) {
      setStatus('Error: ' + error.message);
    }
  };

  const stopSyncthing = async () => {
    try {
      setStatus('Stopping Syncthing...');
      killSyncthing(SyncthingModule)
      setStatus('Stopped');
      setIsRunning(false);
    } catch (error :any) {
      setStatus('Error: ' + error.message);
    }
  };

  const checkSyncthingApi = async () => {
    try {
      setIsApiChecked(true);
      setApiStatus('Checking...');
      
      // Make API request to syncthing server (typically runs on localhost:8384)
      const response = await fetch('http://127.0.0.1:8384/rest/db/completion', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': 'foobar'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setApiStatus('Running');
      } else {
        const data = await response.text();
        console.log(data)
        setApiStatus('Not running');
      }
    } catch (error: any) {
      console.error('Error checking Syncthing API:', error);
      // Provide more specific error messages for common cases
      if (error.message && error.message.includes('Network request failed')) {
        setApiStatus('Network error - Syncthing may not be running or accessible');
      } else {
        setApiStatus('Error: ' + error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Syncthing React Native</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.status}>API Status: {apiStatus}</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title={isRunning ? "Stop Syncthing" : "Start Syncthing"} 
          onPress={isRunning ? stopSyncthing : startSyncthing}
        />
        <Button 
          title="Check Syncthing Status" 
          onPress={checkSyncthingApi}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
    padding: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    alignSelf: 'center',
  },
});
