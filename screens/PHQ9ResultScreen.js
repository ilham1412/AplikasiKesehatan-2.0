// screens/PHQ9Result.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';

export default function PHQ9Result({ route, navigation }) {
  // Ambil data dari route.params, sesuaikan dengan data yang sebenarnya Anda kirim
  // Untuk contoh ini, saya akan menggunakan placeholder jika data tidak tersedia
  const score = route.params?.score ?? 'N/A'; // Skor dari tes
  const categoryText = route.params?.category ?? 'Kategori tidak tersedia'; // Teks kategori/deskripsi singkat skor
  const adviceText = route.params?.advice ?? 'Saran tidak tersedia.'; // Teks saran

  return (
    <SafeAreaView style={styles.overallContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/images/MASEH IJO.png')} // Pastikan path ini benar dan sama dengan layar sebelumnya
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Skor</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <Text style={styles.categoryDescriptionText}>
          {/* Ganti teks ini dengan deskripsi skor atau kategori Anda */}
          {categoryText}
          {/* Contoh: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo facilisis interdum. Quisque ullamcorper ex in ante molestie, at maximus neque volutpat. Nam gravida mi eu augue ornare malesuada scelerisque sit amet diam. Phasellus in purus rutrum eros bibendum dignissim." */}
        </Text>

        <View style={styles.adviceContainer}>
          <Text style={styles.adviceTitle}>Saran</Text>
          <Text style={styles.adviceContentText}>
            {adviceText}
            {/* Contoh: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo facilisis interdum. Quisque ullamcorper ex in ante molestie, at maximus neque volutpat. Nam gravida mi eu augue ornare malesuada scelerisque sit amet diam. Phasellus in purus rutrum eros bibendum dignissim." */}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard')} // Kembali ke layar sebelumnya
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Latar belakang putih
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20, // Memberi padding horizontal pada keseluruhan scroll
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoImage: {
    width: 180,
    height: 60,
  },
  scoreContainer: {
    backgroundColor: '#80CBC4', // Warna latar hijau kebiruan untuk kotak skor
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40, // Padding horizontal agar teks tidak terlalu mepet
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '60%', // Lebar kotak skor, bisa disesuaikan
    minHeight: 100, // Tinggi minimal untuk kotak skor
  },
  scoreTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000', // Warna teks hitam
    marginBottom: 5, // Jarak antara "Skor" dan nilainya
  },
  scoreValue: { // Style tambahan jika Anda ingin membedakan tampilan nilai skor
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  categoryDescriptionText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center', // Teks deskripsi di tengah
    marginBottom: 30,
    paddingHorizontal: 10, // Sedikit padding agar teks tidak terlalu lebar
    lineHeight: 20,
  },
  adviceContainer: {
    backgroundColor: '#E0F2F7', // Warna latar biru muda untuk kotak saran
    borderRadius: 25,
    padding: 20,
    marginBottom: 30,
    width: '100%', // Lebar kotak saran mengikuti padding scroll container
  },
  adviceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  adviceContentText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'left', // Teks saran rata kiri
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#FFFFFF', // Latar belakang putih
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1.5, // Tambahkan border
    borderColor: '#80CBC4', // Warna border hijau kebiruan
    // elevation: 2, // Opsional untuk shadow di Android
    // shadowColor: '#000', // Opsional untuk shadow di iOS
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  backButtonText: {
    color: '#80CBC4', // Warna teks hijau kebiruan
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Hapus atau sesuaikan style lama yang tidak terpakai:
  // container (diganti dengan overallContainer dan scrollContentContainer)
  // title (diganti dengan scoreTitle dan adviceTitle)
  // score (diganti dengan scoreValue dan styling di dalam scoreContainer)
  // category (diganti dengan categoryDescriptionText)
  // advice (diganti dengan adviceContentText)
  // saveButton (diganti dengan backButton)
  // saveButtonText (diganti dengan backButtonText)
});