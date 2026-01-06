import { createSyncthingInstance, generateSyncthingEnvironment, killSyncthing } from '@/utils/syncthing/SyncthingExec';
import { useEffect, useState } from 'react';
import { Button, NativeModules, StyleSheet, Text, View } from 'react-native';

// Get access to our native module
const { SyncthingModule } = NativeModules;

console.log(NativeModules)

export default function Homepage() {
  const [status, setStatus] = useState('Not started');
  const [isRunning, setIsRunning] = useState(false);
  const [isApiChecked, setIsApiChecked] = useState(false);
  const [apiStatus, setApiStatus] = useState('Not checked');

  
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
      await createSyncthingInstance(SyncthingModule, generateSyncthingEnvironment())
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
      const response = await fetch('http://localhost:8384/rest/system/status', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiStatus('Running - ' + data.version);
      } else {
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
          disabled={status.includes('ing...')}
        />
        <Button 
          title="Check Syncthing Status" 
          onPress={checkSyncthingApi}
          disabled={isApiChecked && status.includes('ing...')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
  },
});
