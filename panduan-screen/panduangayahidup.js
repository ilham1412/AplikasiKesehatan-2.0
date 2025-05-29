import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';

export default function PanduanScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.overallContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/images/MASEH IJO.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.mainContentContainer}>
          <Text style={styles.title}>Panduan</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel eleifend sem.
            Suspendisse vel massa et purus facilisis dapibus. Cras vitae lacus mauris. Sed eget quam quis
            tortor sollicitudin tempor id eu sem. Vestibulum cursus eu erat non euismod. Duis quis libero
            sem. Aenean a justo condimentum, euismod metus quis, accumsan neque. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Mauris vel eleifend sem. Suspendisse vel massa
            et purus facilisis dapibus. Cras vitae lacus mauris. Sed eget quam quis tortor sollicitudin
            tempor id eu sem. Vestibulum cursus eu erat non euismod. Duis quis libero sem. Aenean a
            justo condimentum, euismod metus quis, accumsan neque.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lifestyle')} r
        >
          <Text style={styles.buttonText}>Mulai</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    flexGrow: 1, // Memastikan konten bisa di-scroll jika lebih panjang dari layar
    alignItems: 'center', // Pusatkan konten secara horizontal
    paddingVertical: 20, // Padding atas dan bawah untuk ScrollView
  },
  headerContainer: {
    alignItems: 'center', // Pusatkan logo
    marginBottom: 20, // Jarak antara logo dan kotak panduan
  },
  logoImage: {
    width: 180,
    height: 60,  
  },
  mainContentContainer: {
    backgroundColor: '#E0F2F7', // Warna biru muda seperti di gambar
    borderRadius: 25,          // Membuat sudut melengkung
    padding: 20,
    marginHorizontal: 20,      // Memberi jarak dari sisi layar
    marginBottom: 30,          // Jarak antara kotak panduan dan tombol
  },
  title: {
    fontSize: 28,              // Ukuran font lebih besar untuk judul "Panduan"
    fontWeight: 'bold',
    color: '#000000',          // Warna teks hitam
    textAlign: 'center',       // Teks judul di tengah
    marginBottom: 15,
  },
  text: {
    fontSize: 14,
    color: '#333333',          // Warna teks abu-abu tua
    textAlign: 'left',         // Teks rata kiri
    lineHeight: 20,            // Jarak antar baris
  },
  button: {
    backgroundColor: '#80CBC4', // Warna tombol hijau kebiruan seperti di gambar
    paddingVertical: 15,
    paddingHorizontal: 80,     // Membuat tombol lebih lebar
    borderRadius: 25,          // Sudut tombol melengkung
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});