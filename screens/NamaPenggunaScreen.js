// screens/NamaPenggunaScreen.js
import React, { useState, useEffect } from 'react';
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView, // Untuk area aman di atas dan bawah
  Platform,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView, } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // HAPUS INI
import { setAppSetting, getAppSetting } from '../database/database'; // IMPORT FUNGSI BARU
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LOGO_MASEH = require('../assets/images/MASEH IJO.png');

export default function NamaPenggunaScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Untuk memeriksa nama yang sudah ada

  useEffect(() => {
    const checkExistingName = async () => {
      try {
        const hasSetName = await getAppSetting('hasSetName'); // GUNAKAN FUNGSI BARU
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
      await setAppSetting('userName', nama.trim());    // GUNAKAN FUNGSI BARU
      await setAppSetting('hasSetName', 'true');      // GUNAKAN FUNGSI BARU
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
  // ... sisa JSX tetap sama ...
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image source={LOGO_MASEH} style={styles.logo} />
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
  );
}
// ... styles tetap sama ...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60, 
  },
  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain',
    marginBottom: 10,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#004D40', 
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00695C', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  }
});