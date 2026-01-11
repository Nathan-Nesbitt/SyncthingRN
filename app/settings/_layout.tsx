import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Settings from "./settings";

const Stack = createStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
        options={{ headerShown: true, headerTitle: "Settings" }}
      />
    </Stack.Navigator>
  );
}
