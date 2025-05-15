import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './screens/DashboardScreen';
import PHQ9Screen from './screens/PHQ9Screen';
import PSQIScreen from './screens/PSQIScreen';
import LifestyleScreen from './screens/LifestyleScreen';
import FirstAidScreen from './screens/FirstAidScreen';
import PHQ9ResultScreen from './screens/PHQ9ResultScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import panduanScreen from './screens/PanduanScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Panduan" component={panduanScreen} />
        <Stack.Screen name="PHQ9" component={PHQ9Screen} />
        <Stack.Screen name="PSQI" component={PSQIScreen} />
        <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
        <Stack.Screen name="FirstAid" component={FirstAidScreen} />
        <Stack.Screen name="PHQ9Result" component={PHQ9ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}