// screens/PHQ9ResultScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert } from 'react-native';
// Hanya import addAssessmentResult (getDBConnection akan dipanggil di dalamnya)
import { addAssessmentResult } from '../database/database.js'; // Pastikan path ini benar

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
      // --- PERUBAHAN DI SINI ---
      // Tidak perlu: const db = await getDBConnection();
      
      await addAssessmentResult( // Langsung panggil tanpa argumen 'db'
        // db, // Hapus argumen ini
        'PHQ9', // Tipe asesmen
        score,
        category,
        advice,
        answers ? JSON.stringify(answers) : null // Simpan 'answers' sebagai details
      );
      // --------------------------

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
    <SafeAreaView style={styles.overallContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/images/MASEH IJO.png')} // Pastikan path ini benar
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Skor</Text>
          <Text style={styles.scoreValue}>{score ?? 'N/A'}</Text>
        </View>

        <Text style={styles.categoryDescriptionText}>
          {category ?? 'Kategori tidak tersedia'}
        </Text>

        <View style={styles.adviceContainer}>
          <Text style={styles.adviceTitle}>Saran</Text>
          <Text style={styles.adviceContentText}>
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
  );
}

// Styles (tetap sama persis seperti yang Anda kirim sebelumnya)
const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    backgroundColor: '#80CBC4',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '60%',
    minHeight: 100,
  },
  scoreTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  categoryDescriptionText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  adviceContainer: {
    backgroundColor: '#E0F2F7',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    width: '100%',
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
    textAlign: 'left',
    lineHeight: 20,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#80CBC4',
  },
  backButtonText: {
    color: '#80CBC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  }
});