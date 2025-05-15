// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
// Menggunakan Icon untuk placeholder logo, Anda bisa menggantinya dengan Image
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4DB6AC" />
        <Image source={require('../assets/images/MASEH PUTIH.png')} style={styles.logoImage}/>
      <Text style={styles.appName}>MASEH</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Dashboard')} // Navigasi tetap sama
      >
        <Text style={styles.buttonText}>Mulai</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64C8C8', // Warna teal muda seperti di gambar
    justifyContent: 'center', // Memusatkan konten secara vertikal
    alignItems: 'center', // Memusatkan konten secara horizontal
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center', // Pastikan ikon di tengah jika container lebih besar
  },
  logoImage: { // Aktifkan dan sesuaikan ini jika menggunakan file gambar untuk logo
     width: 150,
     height: 150,
     resizeMode: 'contain',
     marginBottom: 20,
   },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF', // Warna teks putih
    marginBottom: 80, // Jarak antara nama aplikasi dan tombol
    letterSpacing: 1,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Warna tombol putih dengan sedikit transparansi atau solid
    paddingVertical: 15,
    paddingHorizontal: 60, // Membuat tombol lebih lebar
    borderRadius: 30, // Membuat sudut tombol sangat membulat (capsule shape)
    width: '80%', // Lebar tombol relatif terhadap container
    maxWidth: 300, // Lebar maksimum tombol
    alignItems: 'center', // Teks di tengah tombol
    shadowColor: "#000", // Bayangan untuk efek kedalaman (opsional)
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3, // Elevasi untuk Android
  },
  buttonText: {
    color: '#00796B', // Warna teks tombol (teal tua)
    fontSize: 18,
    fontWeight: 'bold',
  },
});
