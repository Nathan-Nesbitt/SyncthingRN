import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSyncthing } from '../../utils/syncthing/SyncthingProvider';
import { Device } from '../../utils/syncthing/api/SyncthingAPITypes';
import DeviceComponent from './device';

const DevicesList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { api, isInitialized } = useSyncthing();

  useEffect(() => {
    const fetchDevices = async () => {
      if (!isInitialized || !api) {
        // If not initialized or API not available, don't attempt to fetch
        setLoading(false);
        return;
      }
      
      try {
        // Get devices from Syncthing config
        const deviceList = await api.getConfigDevices();
        setDevices(deviceList);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error(err);
        setError('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [isInitialized, api]);

  if (!isInitialized) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (devices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>No devices found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.deviceID}
      renderItem={({ item }) => <DeviceComponent device={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default DevicesList;
