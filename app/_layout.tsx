import React from 'react';
import Index from './index';
import SettingsNavigator from "./settings/_layout";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Icon, SettingsIcon } from "@/components/ui/icon";
import '@/global.css';
import { Link } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    
    <GluestackUIProvider mode="light">
      <Stack.Navigator initialRouteName="Syncthing Android" 
        screenOptions={{ 
          headerStatusBarHeight: 40,
          headerShown: true,
          headerRight: () => {return <Link screen="Settings" className='mr-4' params={{ screen: 'Syncthing' }}><Icon as={SettingsIcon}/></Link> },
          headerStyle: { 
            height: 90,
          },
          headerTitleStyle: {
            height: 30,
            marginTop: 2,
          }
        }}
      >
      <Stack.Screen 
        name="Syncthing Android"
        component={Index}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsNavigator} 
      />
    </Stack.Navigator>
    </GluestackUIProvider>
  
  );
}