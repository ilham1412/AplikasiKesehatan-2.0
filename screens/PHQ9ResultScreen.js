// screens/PHQ9ResultScreen.js
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
  ImageBackground, // <-- Tambahkan ImageBackground
  StatusBar,       // <-- Tambahkan StatusBar
  Platform
} from 'react-native';
import { addAssessmentResult } from '../database/database.js';

// Ganti dengan path gambar LATAR BELAKANG BERPOLA GELAP Anda
const BACKGROUND_HASIL_GELAP = require('../assets/images/Panduan.png'); // Gunakan gambar yang sama atau buat yang baru
// Logo untuk header (mungkin versi terang jika latar gelap)
const LOGO_HEADER_HASIL = require('../assets/images/Layer 2.png'); // Ganti dengan logo yang kontras

export default function PHQ9ResultScreen({ route, navigation }) {
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
        'PHQ9',
        score,
        category,
        advice,
        answers ? JSON.stringify(answers) : null
      );
      setHasSaved(true);
      Alert.alert('Sukses', 'Hasil tes berhasil disimpan ke riwayat.');
    } catch (error) {
      console.error('Failed to save PHQ9 result from ResultScreen:', error);
      Alert.alert('Error', 'Gagal menyimpan hasil tes. Silakan coba lagi.');
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
              source={LOGO_HEADER_HASIL} // Logo yang kontras dengan latar gelap
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>Skor Anda</Text>
            <Text style={styles.scoreValue}>{score ?? 'N/A'}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Kategori Penilaian</Text>
            <Text style={styles.cardContent}>
              {category ?? 'Kategori tidak tersedia'}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Saran Untuk Anda</Text>
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
    backgroundColor: 'transparent', // Penting agar ImageBackground terlihat
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30, // Padding atas dan bawah lebih besar
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30, // Jarak lebih besar
  },
  logoImage: {
    width: 160, // Sesuaikan ukuran logo
    height: 55,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Latar semi-transparan terang
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    width: '70%', // Sedikit lebih lebar
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scoreTitle: {
    fontSize: 24, // Sedikit lebih kecil agar proporsional
    fontWeight: 'bold',
    color: '#FFFFFF', // Teks putih
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36, // Skor lebih besar
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultCard: { // Menggantikan categoryDescriptionText dan adviceContainer
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Latar semi-transparan gelap
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
    color: '#E0F2F7', // Warna teks judul kartu (biru muda terang)
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 15,
    color: '#CFD8DC', // Warna teks konten kartu (abu-abu terang)
    lineHeight: 22,
  },
  actionButton: {
    paddingVertical: 15, // Sedikit lebih tinggi
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '85%', // Lebih lebar
    maxWidth: 340,
    marginBottom: 15,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#4DB6AC', // Warna hijau mint (sesuaikan agar kontras)
  },
  actionButtonText: {
    color: '#FFFFFF', // Teks putih
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent', // Tombol kembali transparan dengan border
    borderWidth: 1.5,
    borderColor: '#80CBC4', // Border hijau mint terang
  },
  backButtonText: {
    color: '#80CBC4', // Teks hijau mint terang
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(77, 182, 172, 0.5)', // Warna saveButton dengan opacity
  }
});