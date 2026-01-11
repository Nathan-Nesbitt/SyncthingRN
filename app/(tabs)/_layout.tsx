import { Icon, SettingsIcon } from "@/components/ui/icon";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Link } from "@react-navigation/native";
import { House, Monitor } from "lucide-react-native";
import React from 'react';
import Devices from '../devices';
import Index from '../index';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStatusBarHeight: 50,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Syncthing') {
            return <Icon as={House} size="xl" color={color} />;
          } else if (route.name === 'Devices') {
            return <Icon as={Monitor} size="xl" color={color} />;
          }
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Syncthing" 
        component={Index} 
        options={({ navigation }) => ({
          headerRight: () => {return <Link screen="Settings" className='mr-4' params={{ screen: 'Syncthing' }}><Icon as={SettingsIcon}/></Link> },
          headerShown: true,
          headerStyle: { 
            height: 90,
          },
          headerTitleStyle: {
            height: 30,
            marginTop: 2,
          }
        })}
      />
      <Tab.Screen 
        name="Devices" 
        component={Devices} 
        options={({ navigation }) => ({
          headerRight: () => {return <Link screen="Settings" className='mr-4' params={{ screen: 'Syncthing' }}><Icon as={SettingsIcon}/></Link> },
          headerShown: true,
          headerStyle: { 
            height: 90,
          },
          headerTitleStyle: {
            height: 30,
            marginTop: 2,
          }
        })}
      />
    </Tab.Navigator>
  );
}
