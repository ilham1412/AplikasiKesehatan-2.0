// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Hapus ActivityIndicator, View, StyleSheet dari sini JIKA HANYA dipakai untuk LoadingScreen lama
// import { ActivityIndicator, View, StyleSheet } from 'react-native'; 

// Import screens Anda
import WelcomeScreen from './screens/WelcomeScreen';
import NamaPenggunaScreen from './screens/NamaPenggunaScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen'; // <-- IMPORT LoadingScreen DARI FILE BARU
// ... (import screen lainnya yang sudah ada)
import PHQ9Screen from './screens/PHQ9Screen';
import PSQIScreen from './screens/PSQIScreen';
import LifestyleScreen from './screens/LifestyleScreen';
import FirstAidScreen from './screens/FirstAidScreen';
import PHQ9ResultScreen from './screens/PHQ9ResultScreen';
import Panduanstres from './panduan-screen/Panduanstres';
import Panduangayahidup from './panduan-screen/panduangayahidup';
import Panduantidur from './panduan-screen/panduantidur';
import RiwayatScreen from './screens/RiwayatScreen';
import RiwayatDetailScreen from './screens/RiwayatDetailScreen';
import SettingsScreen from './screens/SettingsScreen';  
import AboutUsScreen from './screens/AboutUsScreen';

import { initDatabase, getAppSetting } from './database/database.js';

const Stack = createNativeStackNavigator();

// HAPUS DEFINISI LoadingScreen LAMA DARI SINI
// const LoadingScreen = () => ( ... );

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDatabase();
        console.log("Database successfully initialized from App.js");

        const hasSetName = await getAppSetting('hasSetName');
        if (hasSetName === 'true') {
          console.log("Nama pengguna sudah diset, mengarahkan ke Dashboard.");
          setInitialRouteName('Dashboard');
        } else {
          console.log("Nama pengguna belum diset, mengarahkan ke Welcome.");
          setInitialRouteName('Welcome');
        }
      } catch (error) {
        console.error("Failed to initialize app or read settings:", error);
        setInitialRouteName('Welcome');
      } finally {
        // Opsional: Tambahkan delay jika ingin loading screen terlihat lebih lama
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 1500); // Contoh 1.5 detik
         setIsLoading(false); // Jika tidak pakai setTimeout
      }
    };

    initializeApp();
  }, []);

  if (isLoading || !initialRouteName) {
    return <LoadingScreen />; // Gunakan komponen LoadingScreen yang diimpor
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NamaPengguna" component={NamaPenggunaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} />  
        <Stack.Screen name="Panduan1" component={Panduanstres} />
        <Stack.Screen name="Panduan2" component={Panduangayahidup} />
        <Stack.Screen name="Panduan3" component={Panduantidur} />
        <Stack.Screen name="PHQ9" component={PHQ9Screen} />
        <Stack.Screen name="PSQI" component={PSQIScreen} />
        <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
        <Stack.Screen name="FirstAid" component={FirstAidScreen} />
        <Stack.Screen name="PHQ9Result" component={PHQ9ResultScreen} />
        <Stack.Screen name="Riwayat" component={RiwayatScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RiwayatDetail" component={RiwayatDetailScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// HAPUS styles.loadingContainer DARI SINI JIKA SUDAH DIPINDAH KE LoadingScreen.js
// const styles = StyleSheet.create({
//   loadingContainer: { ... }
// });