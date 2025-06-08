// screens/PSQIResultScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  ImageBackground,
  StatusBar,
  Platform
} from 'react-native';
import { addAssessmentResult } from '../database/database.js';

// Ganti dengan path gambar LATAR BELAKANG BERPOLA GELAP Anda
const BACKGROUND_HASIL_GELAP = require('../assets/images/Panduan.png'); // Gunakan gambar yang sama atau buat yang baru
// Logo untuk header (mungkin versi terang jika latar gelap)
const LOGO_HEADER_HASIL = require('../assets/images/Layer 2.png'); // Ganti dengan logo yang kontras

export default function PSQIResultScreen({ route, navigation }) {
  const { score, category, advice, answers } = route.params || {};
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSaveResult = async () => {
    if (hasSaved) {
      Alert.alert("Info", "Hasil ini sudah disimpan ke riwayat.");
      return;
    }
    setIsSaving(true);
    try {
      await addAssessmentResult(
        'PSQI',
        score,
        category,
        advice,
        answers ? JSON.stringify(answers) : null
      );
      setHasSaved(true);
      Alert.alert('Sukses', 'Hasil tes kualitas tidur berhasil disimpan ke riwayat.');
    } catch (error) {
      console.error('Failed to save PSQI result from ResultScreen:', error);
      Alert.alert('Error', 'Gagal menyimpan hasil tes kualitas tidur. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ImageBackground
      source={BACKGROUND_HASIL_GELAP}
      style={styles.backgroundImageContainer}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.headerContainer}>
            <Image
              source={LOGO_HEADER_HASIL}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Bagian skor kualitas tidur TIDAK DITAMPILKAN */}
          {/* <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>Skor Kualitas Tidur Anda</Text>
            <Text style={styles.scoreValue}>{score ?? 'N/A'}</Text>
          </View> */}

          <View style={styles.categoryCard}> {/* Menggunakan style baru untuk kategori */}
            {/* <Text style={styles.categoryTitle}>Kategori Kualitas Tidur Anda</Text> */}
            <Text style={styles.categoryContent}>
              {category ?? 'Kategori tidak tersedia'}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Saran Untuk Kualitas Tidur Anda</Text>
            <Text style={styles.cardContent}>
              {advice ?? 'Saran tidak tersedia.'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton, hasSaved && styles.disabledButton]}
            onPress={handleSaveResult}
            disabled={isSaving || hasSaved}
          >
            <Text style={styles.actionButtonText}>
              {isSaving ? "Menyimpan..." : (hasSaved ? "Tersimpan ✓" : "Simpan ke Riwayat")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.backButton]}
            onPress={() => navigation.replace('Dashboard')}
          >
            <Text style={styles.backButtonText}>Selesai</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 160,
    height: 55,
  },
  // scoreContainer dihapus
  categoryCard: { // Style baru untuk menonjolkan kategori
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Latar belakang semi-transparan terang
    borderRadius: 15,
    paddingVertical: 30, // Lebih besar
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25, // Jarak ke elemen berikutnya
    width: '90%', // Lebih lebar
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryTitle: { // Menonjolkan judul kategori
    fontSize: 26, // Ukuran font lebih besar
    fontWeight: 'bold',
    color: '#FFFFFF', // Teks putih
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryContent: { // Menonjolkan konten kategori
    fontSize: 28, // Ukuran font lebih besar lagi
    fontWeight: 'bold',
    color: '#FFFFFF', // Teks putih
    textAlign: 'center',
    lineHeight: 36, // Jarak baris
  },
  resultCard: { // Ini adalah style untuk saran, sama seperti sebelumnya
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0F2F7',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 15,
    color: '#CFD8DC',
    lineHeight: 22,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    marginBottom: 15,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#4DB6AC',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#80CBC4',
  },
  backButtonText: {
    color: '#80CBC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(77, 182, 172, 0.5)',
  }
});