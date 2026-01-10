import Folders from '@/components/folders';
import { Button, ButtonText } from '@/components/ui/button';
import SyncthingAPI from '@/utils/syncthing/api/SyncthingAPI';
import { generateSyncthingEnvironment, spawnSyncthingWorker } from '@/utils/syncthing/SyncthingModule';
import { useEffect, useState } from 'react';
import { NativeModules, ScrollView, StyleSheet, Text, View } from 'react-native';

// Get access to our native module
const { SyncthingModule } = NativeModules;

export default function Index() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  
  // Initialize Syncthing when component mounts
  useEffect(() => {
    const initialize = async () => {
      try {
        if (SyncthingModule) {
          console.log("Initializing Syncthing native module...");
          console.log("Starting syncthing");
          spawnSyncthingWorker(SyncthingModule, generateSyncthingEnvironment())
          setIsInitialized(true);
        } 
      } catch (error: any) {
        console.error('Error initializing Syncthing:', error);
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    const api = new SyncthingAPI("foobar");
    api.getNoAuthHealth().then(result => {
      if(result.status === "OK") {
        setIsRunning(true);
      }
    });
  }, [isInitialized])

  const checkSyncthingApi = async () => {
    const api = new SyncthingAPI("foobar");
    api.getNoAuthHealth().then(result => {
      if(result.status === "OK") {
        setIsRunning(true);
      }
    })
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.status}>Syncthing Initialized: {String(isInitialized)}</Text>
      <Text style={styles.status}>API Status: {String(isRunning)}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          onPress={checkSyncthingApi}
        >
          <ButtonText>Check Syncthing Status </ButtonText>
        </Button>
      </View>
      <Folders/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 20,
  }
});
