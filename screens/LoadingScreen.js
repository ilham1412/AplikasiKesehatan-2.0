// screens/LoadingScreen.js
import React from 'react';
import { View, StyleSheet, Text, Image, StatusBar } from 'react-native';

const LOGO_MASEH_LOADING = require('../assets/images/MASEH PUTIH.png'); // Sesuaikan path jika perlu

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4DB6AC" />
      <Image 
        source={LOGO_MASEH_LOADING} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      {/* Jika teks "maseh" adalah bagian dari gambar logo, baris Text di bawah ini tidak diperlukan. */}
      {/* Jika terpisah, pastikan ada komponen <Text> seperti ini: */}
      {/* <Text style={styles.appName}>maseh</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#64C8C8',
  },
  logo: {
    width: 150,
    height: 150,
    // marginBottom: 20, // Aktifkan jika ada teks "maseh" di bawahnya
  },
  // appName: { // Aktifkan jika teks "maseh" terpisah
  //   fontSize: 48,
  //   fontWeight: 'bold',
  //   color: '#FFFFFF', 
  //   textTransform: 'lowercase',
  //   marginTop: 10,
  // }
});