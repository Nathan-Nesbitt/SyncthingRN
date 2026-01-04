import { useSyncthing } from '@/utils/syncthing/SyncthingContext';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


export default function Homepage() {
  const [status, setStatus] = useState('Not started');
  const [isRunning, setIsRunning] = useState(false);

  const { syncthing } = useSyncthing();

  
  // For Expo, we'll simulate the Syncthing functionality
  // In a real implementation, you'd use Expo's APIs or EAS build with custom native modules
  const startSyncthing = async () => {
    try {
      setStatus('Starting...');
      // Simulate starting process
      setStatus('Running');
      setIsRunning(true);
    } catch (error :any) {
      setStatus('Error: ' + error.message);
    }
  };

  const stopSyncthing = async () => {
    try {
      setStatus('Stopping...');
      // Simulate stopping process
      await exec("syncthing serve");
      setStatus('Stopped');
      setIsRunning(false);
    } catch (error :any) {
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Syncthing React Native</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title={isRunning ? "Stop Syncthing" : "Start Syncthing"} 
          onPress={isRunning ? stopSyncthing : startSyncthing}
          disabled={status.includes('ing...')}
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