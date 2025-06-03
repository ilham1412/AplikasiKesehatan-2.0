// screens/NamaPenggunaScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  // ScrollView, // Tidak diperlukan jika kontennya tidak panjang
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ImageBackground // <-- Tambahkan ImageBackground
} from 'react-native';
import { setAppSetting, getAppSetting } from '../database/database.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LOGO_MASEH = require('../assets/images/Maseh logo og.png'); // Logo utama yang jelas
// Ganti dengan path gambar LATAR BELAKANG BERPOLA Anda
const BACKGROUND_NAMA_PENGGUNA = require('../assets/images/opening background.png'); 

export default function NamaPenggunaScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingName = async () => {
      try {
        const hasSetName = await getAppSetting('hasSetName');
        if (hasSetName === 'true') {
          navigation.replace('Dashboard');
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Gagal membaca status nama dari SQLite", e);
        setIsLoading(false);
      }
    };
    checkExistingName();
  }, [navigation]);

  const handleLanjutkan = async () => {
    if (nama.trim() === '') {
      Alert.alert('Nama Diperlukan', 'Mohon masukkan nama Anda.');
      return;
    }
    try {
      await setAppSetting('userName', nama.trim());
      await setAppSetting('hasSetName', 'true');
      Alert.alert('Sukses', 'Nama berhasil disimpan!');
      navigation.replace('Dashboard');
    } catch (e) {
      console.error("Gagal menyimpan nama ke SQLite", e);
      Alert.alert('Error', 'Gagal menyimpan nama. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return null; // Atau <ActivityIndicator />;
  }

  return (
    <ImageBackground
        source={BACKGROUND_NAMA_PENGGUNA}
        style={styles.backgroundImageContainer}
        resizeMode="cover" // atau "stretch"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Atur StatusBar agar kontras dengan latar belakang Anda */}
        <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} /> 
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          // Jika KeyboardAvoidingView tidak bekerja dengan baik dengan ImageBackground,
          // Anda mungkin perlu membungkus konten di dalam ScrollView kecil
          // atau menyesuaikan offset keyboard.
        >
          {/* Konten akan berada di atas ImageBackground */}
          <View style={styles.logoContainer}>
            <Image source={LOGO_MASEH} style={styles.logo} resizeMode="contain"/>
            <Text style={styles.appName}>maseh</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan nama anda"
              placeholderTextColor="#A0A0A0"
              value={nama}
              onChangeText={setNama}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleLanjutkan}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLanjutkan}>
            <Text style={styles.buttonText}>Lanjutkan</Text>
            <Icon name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Penting agar ImageBackground terlihat
    // paddingTop sudah dihandle oleh KeyboardAvoidingView atau padding di container jika perlu
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 30,
    // backgroundColor: 'rgba(255,255,255,0.7)', // Opsional: Beri sedikit overlay warna jika latar terlalu ramai
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60, 
  },
  logo: {
    width: 100, 
    height: 100, 
    marginBottom: 10,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00695C', // Warna ini mungkin perlu disesuaikan agar kontras dengan background baru
    textTransform: 'lowercase',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40, 
  },
  textInput: {
    backgroundColor: '#FFFFFF', 
    borderWidth: 1,
    borderColor: '#B0BEC5', 
    borderRadius: 25, 
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333333',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00695C', // Warna ini mungkin perlu disesuaikan
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8, 
  },
  buttonIcon: {
    // Tidak ada style tambahan yang diperlukan di sini
  }
});