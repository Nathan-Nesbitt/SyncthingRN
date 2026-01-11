import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from '../../components/ui/button';
import { Checkbox, CheckboxIndicator, CheckboxLabel } from '../../components/ui/checkbox';
import { Heading } from '../../components/ui/heading';
import { Input, InputField } from '../../components/ui/input';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '../../components/ui/modal';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '../../components/ui/select';
import { Text } from '../../components/ui/text';
import { useSyncthing } from '../../utils/syncthing/SyncthingProvider';
import { AddDeviceInput } from '../../utils/syncthing/api/SyncthingAPITypes';

interface AddDeviceProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDeviceModal: React.FC<AddDeviceProps> = ({ isOpen, onClose }) => {
  const { api, isInitialized } = useSyncthing();
  const [newDevice, setNewDevice] = useState<AddDeviceInput>({
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
  const [error, setError] = useState<string | null>(null);

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
      
      // Close modal and reset form
      setIsAddingDevice(false);
      onClose();
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
      } as AddDeviceInput);
    } catch (err) {
      console.error(err);
      setError('Failed to add device');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Add New Device</Heading>
        </ModalHeader>
        <ModalBody>
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-base font-bold text-gray-700">Device ID *</Text>
              <Input>
                <InputField
                  value={newDevice.deviceID}
                  onChangeText={(text) => updateDeviceField('deviceID', text)}
                  className="border border-gray-300 rounded-md p-2 text-base bg-white"
                />
              </Input>
            </View>
            
            <View className="gap-2">
              <Text className="text-base font-bold text-gray-700">Name *</Text>
              <Input>
                <InputField
                  value={newDevice.name}
                  onChangeText={(text) => updateDeviceField('name', text)}
                  className="border border-gray-300 rounded-md p-2 text-base bg-white"
                />
              </Input>
            </View>
            
            <View className="gap-2">
              <Text className="text-base font-bold text-gray-700">Addresses</Text>
              {newDevice.addresses.map((address, index) => (
                <View key={index} className="flex-row gap-2 items-center">
                  <Input className="flex-1">
                    <InputField
                      value={address}
                      onChangeText={(text) => updateAddress(index, text)}
                      className="border border-gray-300 rounded-md p-2 text-base bg-white"
                    />
                  </Input>
                  <Button 
                    variant="outline" 
                    action="secondary"
                    onPress={() => removeAddress(index)}
                  >
                    <ButtonText>Remove</ButtonText>
                  </Button>
                </View>
              ))}
              <Button 
                variant="outline" 
                action="secondary"
                onPress={addAddress}
              >
                <ButtonText>Add Address</ButtonText>
              </Button>
            </View>
            
            <View className="gap-2">
              <Text className="text-base font-bold text-gray-700">Compression</Text>
              <Select
                selectedValue={newDevice.compression}
                onValueChange={(value) => updateDeviceField('compression', value)}
              >
                <SelectTrigger className="border border-gray-300 rounded-md p-2 text-base bg-white">
                  <SelectInput className="flex-1" />
                  <SelectIcon className="ml-2" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="metadata" value="metadata" />
                    <SelectItem label="always" value="always" />
                    <SelectItem label="never" value="never" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
            
            <View className="gap-2">
              <Text className="text-base font-bold text-gray-700">Paused</Text>
              <View className="flex-row items-center gap-2">
                <Checkbox
                  value="paused"
                  isChecked={newDevice.paused}
                  onChange={(checked) => updateDeviceField('paused', checked as boolean)}
                >
                  <CheckboxIndicator />
                  <CheckboxLabel>Pause device</CheckboxLabel>
                </Checkbox>
              </View>
            </View>
            
            {error && (
              <Text className="text-red-500 text-center">{error}</Text>
            )}
          </View>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="outline" 
            action="secondary" 
            onPress={onClose}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button 
            action="primary" 
            onPress={handleAddDevice}
            disabled={isAddingDevice}
          >
            <ButtonText>{isAddingDevice ? 'Adding...' : 'Add Device'}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddDeviceModal;
