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
import { addAssessmentResult } from '../database/database.js'; // Pastikan path ini benar

// Ganti dengan path gambar LATAR BELAKANG BERPOLA GELAP Anda
// Anda bisa menggunakan gambar yang sama dengan PHQ9ResultScreen atau buat yang baru
const BACKGROUND_HASIL_GELAP = require('../assets/images/Panduan.png'); 
// Logo untuk header (mungkin versi terang jika latar gelap)
const LOGO_HEADER_HASIL = require('../assets/images/Layer 2.png'); // Ganti dengan logo yang kontras

export default function PSQIResultScreen({ route, navigation }) {
  // Ambil data dari route.params. Pastikan PSQIScreen mengirimkan parameter ini.
  // Parameter 'score' di sini adalah total skor PSQI Global.
  const { score, category, advice, fullAnswers } = route.params || {}; // 'fullAnswers' adalah semua jawaban mentah dari PSQI

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
        'PSQI', // <-- Tipe asesmen diubah menjadi 'PSQI'
        score,
        category,
        advice,
        fullAnswers ? JSON.stringify(fullAnswers) : null // Simpan semua jawaban PSQI sebagai details
      );
      setHasSaved(true);
      Alert.alert('Sukses', 'Hasil tes kualitas tidur berhasil disimpan ke riwayat.');
    } catch (error) {
      console.error('Failed to save PSQI result from ResultScreen:', error);
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
              source={LOGO_HEADER_HASIL}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.scoreContainer}>
            {/* Judul bisa disesuaikan untuk PSQI */}
            <Text style={styles.scoreTitle}>Skor Kualitas Tidur Anda</Text>
            <Text style={styles.scoreValue}>{score ?? 'N/A'}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Kategori Kualitas Tidur</Text>
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
          
          {/* Opsional: Tampilkan detail skor komponen PSQI jika Anda mengirimkannya */}
          {/* Misalnya, jika route.params.components ada:
          {route.params.components && (
            <View style={styles.resultCard}>
              <Text style={styles.cardTitle}>Detail Skor Komponen:</Text>
              <Text style={styles.cardContent}>Durasi Tidur: {route.params.components.scoreDurat}</Text>
              <Text style={styles.cardContent}>Gangguan Tidur: {route.params.components.scoreDistb}</Text>
              // ... tambahkan komponen skor lainnya ...
            </View>
          )}
          */}

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

// Styles bisa menggunakan yang sama dengan PHQ9ResultScreen.js
// atau Anda bisa membuat beberapa penyesuaian kecil jika perlu.
// Saya akan menyalin styles dari PHQ9ResultScreen.js yang sudah Anda berikan.
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
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    width: '70%',
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center', // Untuk judul yang mungkin lebih panjang
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultCard: {
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
