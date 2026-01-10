import { CloseIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSyncthing } from '@/utils/syncthing/SyncthingProvider';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from './ui/button';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from './ui/modal';


export default function Folders() {
    const [folders, setFolders] = useState<any[]>([]);
    const [foldersLoading, setFoldersLoading] = useState(false);
    const [foldersError, setFoldersError] = useState<string | null>(null);
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const syncthing = useSyncthing();

    // Fetch folders data when component mounts
    useEffect(() => {
        fetchFolders();
    }, []);

    // Fetch folders data
    const fetchFolders = async () => {
        try {
            setFoldersLoading(true);
            setFoldersError(null);
            
            const folderStats = await syncthing.api?.getStatsFolder();
            
            // Convert stats folder object to array for display
            const folderArray = Object.entries(folderStats ? folderStats : []).map(([folderId, folderData]) => ({
                id: folderId,
                ...folderData
            }));
            
            setFolders(folderArray);
        } catch (error: any) {
            console.error('Error fetching folders:', error);
            setFoldersError('Failed to fetch folders: ' + error.message);
        } finally {
            setFoldersLoading(false);
        }
    };

    // Pause all syncing
    const pauseAll = async () => {
        try {
            syncthing.api?.postSystemPause();
            // Refresh folders data after pausing
            fetchFolders();
        } catch (error: any) {
            console.error('Error pausing all syncing:', error);
            setFoldersError('Failed to pause syncing: ' + error.message);
        }
    };

    // Rescan all folders
    const rescanAll = async () => {
        try {
            // This endpoint doesn't seem to exist in the API - we'll scan each folder individually
            // Or we can use the global scan endpoint if available
            await syncthing.api?.postDBScan();
            // Refresh folders data after rescanning
            fetchFolders();
        } catch (error: any) {
            console.error('Error rescanning all folders:', error);
            setFoldersError('Failed to rescan folders: ' + error.message);
        }
    };

    return (
        <View className='flex w-[100%]'>
            <Text>Folders</Text>
            {foldersLoading ? (
                <Text>Loading folders...</Text>
            ) : foldersError ? (
                <Text>{foldersError}</Text>
            ) : folders.length > 0 ? (
                folders.map((folder) => (
                    <View key={folder.id}>
                        <Text>ID: {folder.id}</Text>
                        <Text>Last Scan: {folder.lastScan}</Text>
                        {folder.lastFile && (
                            <Text>Last File: {folder.lastFile.filename}</Text>
                        )}
                    </View>
                ))
            ) : (
                <Text>No folders found</Text>
            )}
            
            {/* Buttons at the bottom */}
            <View className='flex flex-row space-between w-[100%]'>
                <Button onPress={pauseAll}><ButtonText>Pause All</ButtonText></Button>
                <Button onPress={rescanAll}><ButtonText>Re-Scan All</ButtonText></Button>
                <Button onPress={() => setShowAddFolderModal(true)}><ButtonText>Add Folder</ButtonText></Button>
            </View>

            <AddNewFolder showModal={showAddFolderModal} setShowModal={setShowAddFolderModal}/>
        </View>
    );
}

interface AddNewFolderParams {
  showModal: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

function AddNewFolder(params: AddNewFolderParams) {
  return (
    <Modal
        isOpen={params.showModal}
        onClose={() => {
          params.setShowModal(false);
        }}
      >
      <ModalBackdrop />
      <ModalContent className="max-w-[375px]">
        <ModalHeader>
          <ModalCloseButton>
            <Icon as={CloseIcon} className="stroke-background-500" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className="mb-5" contentContainerClassName="">
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            variant="outline"
            action="secondary"
            size="sm"
            onPress={() => {
              params.setShowModal(false);
            }}
            className="flex-grow"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={() => {
              params.setShowModal(false);
            }}
            size="sm"
            className="flex-grow"
          >
            <ButtonText>Add Folder</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}