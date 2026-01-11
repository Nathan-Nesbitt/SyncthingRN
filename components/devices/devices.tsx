import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { useSyncthing } from '../../utils/syncthing/SyncthingProvider';
import { Device } from '../../utils/syncthing/api/SyncthingAPITypes';
import AddDeviceModal from './addDevice';
import DeviceComponent from './device';

const DevicesList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { api, isInitialized } = useSyncthing();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceID: '',
    name: '',
    addresses: [''],
    compression: 'metadata',
    certName: '',
    introducer: false,
    skipIntroductionRemovals: false,
    introducedBy: '',
    paused: false,
    allowedNetworks: [],
    autoAcceptFolders: false,
    maxSendKbps: 0,
    maxRecvKbps: 0,
    ignoredFolders: [],
    maxRequestKiB: 0,
    untrusted: false,
    remoteGUIPort: 0,
  });
  const [isAddingDevice, setIsAddingDevice] = useState(false);

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

  const handleAddDevice = async () => {
    if (!api) {
      setError('API not available');
      return;
    }

    setIsAddingDevice(true);
    try {
      // Validate required fields
      if (!newDevice.deviceID || !newDevice.name) {
        setError('Device ID and Name are required');
        return;
      }

      // Add the new device
      await api.postConfigDevice(newDevice);
      
      // Refresh the device list
      const deviceList = await api.getConfigDevices();
      setDevices(deviceList);
      
      // Close modal and reset form
      setIsModalVisible(false);
      setNewDevice({
        deviceID: '',
        name: '',
        addresses: [''],
        compression: 'metadata',
        certName: '',
        introducer: false,
        skipIntroductionRemovals: false,
        introducedBy: '',
        paused: false,
        allowedNetworks: [],
        autoAcceptFolders: false,
        maxSendKbps: 0,
        maxRecvKbps: 0,
        ignoredFolders: [],
        maxRequestKiB: 0,
        untrusted: false,
        remoteGUIPort: 0,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to add device');
    } finally {
      setIsAddingDevice(false);
    }
  };

  const updateDeviceField = (field: string, value: string | boolean | string[]) => {
    setNewDevice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAddress = () => {
    setNewDevice(prev => ({
      ...prev,
      addresses: [...prev.addresses, '']
    }));
  };

  const updateAddress = (index: number, value: string) => {
    const updatedAddresses = [...newDevice.addresses];
    updatedAddresses[index] = value;
    setNewDevice(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = newDevice.addresses.filter((_, i) => i !== index);
    setNewDevice(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };

  if (!isInitialized) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2.5 text-base text-gray-700">Initializing...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2.5 text-base text-gray-700">Loading devices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  if (devices.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-700">No devices found</Text>
      </View>
    );
  }

  return (
    <View>
      <View className="items-end p-4">
        <TouchableOpacity 
          className="flex-row items-center bg-gray-200 px-3 py-2 rounded-lg"
          onPress={() => setIsModalVisible(true)}
        >
          <IconSymbol 
            name="plus.circle.fill" 
            size={24} 
            color="#007AFF" 
          />
          <Text className="ml-2 text-base text-blue-600 font-bold">Add Device</Text>
        </TouchableOpacity>
      </View>
      
      {
        devices.map((item)=> <DeviceComponent key={item.deviceID} device={item} />)
      }
      
      <AddDeviceModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default DevicesList;
