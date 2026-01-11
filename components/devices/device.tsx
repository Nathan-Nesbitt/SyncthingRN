import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Device } from '../../utils/syncthing/api/SyncthingAPITypes';

interface DeviceProps {
  device: Device;
}

const DeviceComponent: React.FC<DeviceProps> = ({ device }) => {
  return (
    <View style={styles.deviceContainer}>
      <View style={styles.deviceHeader}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceId}>{device.deviceID.substring(0, 8)}...</Text>
      </View>
      <View style={styles.deviceDetails}>
        <Text style={styles.detailText}>Status: {device.paused ? 'Paused' : 'Connected'}</Text>
        <Text style={styles.detailText}>Addresses: {device.addresses.length > 0 ? device.addresses.join(', ') : 'N/A'}</Text>
        <Text style={styles.detailText}>Compression: {device.compression}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  deviceDetails: {
    marginLeft: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default DeviceComponent;
