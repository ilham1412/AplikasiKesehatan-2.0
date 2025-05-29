import React, { useEffect } from 'react'; // Tambahkan useEffect
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens Anda
import DashboardScreen from './screens/DashboardScreen';
import PHQ9Screen from './screens/PHQ9Screen';
import PSQIScreen from './screens/PSQIScreen';
import LifestyleScreen from './screens/LifestyleScreen';
import FirstAidScreen from './screens/FirstAidScreen';
import PHQ9ResultScreen from './screens/PHQ9ResultScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import Panduanstres from './panduan-screen/Panduanstres';
import Panduangayahidup from './panduan-screen/panduangayahidup';
import Panduantidur from './panduan-screen/panduantidur';
import RiwayatScreen from './screens/RiwayatScreen';
import RiwayatDetailScreen from './screens/RiwayatDetailScreen';
// Import Riwayat Screens jika sudah dibuat
// import RiwayatScreen from './screens/RiwayatScreen';
// import RiwayatDetailScreen from './screens/RiwayatDetailScreen';

// Import fungsi inisialisasi database
import { initDatabase } from './database/database.js'; // Pastikan path ini benar

const Stack = createNativeStackNavigator();

export default function App() {
  // Hook useEffect untuk inisialisasi database saat komponen App dimuat
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        console.log("Database successfully initialized from App.js");
      } catch (error) {
        console.error("Failed to initialize database from App.js", error);
        // Anda bisa menambahkan penanganan error di sini, misalnya menampilkan alert
      }
    };
    initializeDB();
  }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali setelah render awal

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
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
        {/* Tambahkan Riwayat Screens ke navigator jika sudah Anda buat */}
        {/* <Stack.Screen 
          name="Riwayat" 
          component={RiwayatScreen} 
          options={{ headerShown: false }} // Contoh, sesuaikan options jika perlu
        />
        <Stack.Screen 
          name="RiwayatDetail" 
          component={RiwayatDetailScreen} 
          options={{ headerShown: false }} // Contoh, sesuaikan options jika perlu
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}