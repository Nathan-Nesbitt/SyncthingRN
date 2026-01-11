import DevicesList from '@/components/devices/devices';
import Folders from '@/components/folders';
import { Button, ButtonText } from '@/components/ui/button';
import { generateSyncthingEnvironment } from '@/utils/syncthing/SyncthingModule';
import { useSyncthing } from '@/utils/syncthing/SyncthingProvider';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const [isRunning, setIsRunning] = useState(false);
  const syncthing = useSyncthing();
  
  // Initialize Syncthing when component mounts
  useEffect(() => {
    
  }, []);

  const checkSyncthingApi = async () => {
    syncthing.api?.getNoAuthHealth().then(result => {
      if(result.status === "OK") {
        setIsRunning(true);
      }
    })
  };

  const spawnSyncthingWorker = () => {
    syncthing.module?.spawnSyncthingWorker(generateSyncthingEnvironment())
    syncthing.updateApiKey();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.status}>Syncthing Initialized: {String(syncthing.isInitialized)}</Text>
      <Text style={styles.status}>API Status: {String(isRunning)}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          onPress={spawnSyncthingWorker}
        >
          <ButtonText>Start Syncthing</ButtonText>
        </Button>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          onPress={checkSyncthingApi}
        >
          <ButtonText>Check Syncthing Status </ButtonText>
        </Button>
      </View>
      
      <View style={styles.section}>
        <Folders/>
      </View>
      
      <View style={styles.section}>
        <DevicesList />
      </View>
    </ScrollView>
  );
};

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
  },
  section: {
    marginBottom: 20,
  }
});
