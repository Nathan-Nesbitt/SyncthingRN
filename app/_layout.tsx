import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Index from './index';
import Settings from './settings';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen 
        name="Home" 
        component={Index} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='house-chimney' iconStyle="solid" size={25} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='gear' iconStyle="solid" size={25}/>
          ),
        }} 
      />
    </Tab.Navigator>
  );
}