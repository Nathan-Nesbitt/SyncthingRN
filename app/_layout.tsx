import React from 'react';
import TabLayout from './(tabs)/_layout';
import SettingsNavigator from "./settings/_layout";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { SyncthingProvider } from '@/utils/syncthing/SyncthingProvider';
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    
    <GluestackUIProvider mode="light">
      <SyncthingProvider>
        <Stack.Navigator initialRouteName="TabLayout">
          <Stack.Screen 
            name="TabLayout" 
            component={TabLayout} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsNavigator} 
            options={{ headerShown: true, headerTitle: "Settings" }}
          />
        </Stack.Navigator>
      </SyncthingProvider>
    </GluestackUIProvider>
  
  );
}
