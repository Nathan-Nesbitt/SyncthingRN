import React, { createContext, useContext, useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import { SyncthingModule as ReactSyncthingModule } from './SyncthingModule';
import SyncthingAPI from './api/SyncthingAPI';

// Define the context type
interface SyncthingAPIContextType {
  api: SyncthingAPI | null;
  module: ReactSyncthingModule | null;
  isInitialized: boolean;
  updateApiKey: () => void
}

// Create the context
const SyncthingContext = createContext<SyncthingAPIContextType | undefined>(undefined);

/**
 * Provider component for the Syncthing API context
 */
export const SyncthingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, setApi] = useState<SyncthingAPI | null>(null);
  const [module, setModule] = useState<ReactSyncthingModule | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate random API key on component mount
  useEffect(() => {
    const { SyncthingModule } = NativeModules;
    if (!SyncthingModule) return
    console.log("Syncthing module found")
    setModule(SyncthingModule);  
  }, []);

  useEffect(() => {
    module?.getAPIKey().then(apikey => {
      setApi(new SyncthingAPI(apikey.trim()));
      setIsInitialized(true)
    })
  }, [module])

  const updateApiKey = () => {
    module?.getAPIKey().then(apikey => {
      setApi(new SyncthingAPI(apikey.trim()));
    })
  }

  // Expose the context value
  const contextValue: SyncthingAPIContextType = {
    api,
    module,
    isInitialized,
    updateApiKey
  };

  return (
    <SyncthingContext.Provider value={contextValue}>
      {children}
    </SyncthingContext.Provider>
  );
};

/**
 * Custom hook to use the Syncthing API context
 */
export const useSyncthing = () => {
  const context = useContext(SyncthingContext);
  
  if (context === undefined || context.api === undefined || context.module === undefined) {
    throw new Error('useSyncthingAPI must be used within a SyncthingProvider');
  }
  
  return context;
};