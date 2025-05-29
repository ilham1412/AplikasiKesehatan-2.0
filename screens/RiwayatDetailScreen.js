// src/screens/RiwayatDetailScreen.js
import React, { useState, useEffect } from 'react'; // useCallback dihapus jika tidak digunakan lagi secara langsung
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
// Hanya import getAssessmentResultById (getDBConnection akan dipanggil di dalamnya)
import { getAssessmentResultById } from '../database/database'; // Sesuaikan path
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const assessmentDisplayInfo = {
  PHQ9: { title: 'Detail Tingkat Stres' },
  SleepQuality: { title: 'Detail Kualitas Tidur' },
  Lifestyle: { title: 'Detail Gaya Hidup' },
  // Tambahkan info lain jika perlu
};

// Objek assessmentInfo ini lebih baik jika diimpor dari satu sumber yang sama
// dengan RiwayatScreen.js, atau didefinisikan di file utilitas.
// Untuk sekarang, kita duplikasi saja agar komponen ini mandiri.
const assessmentInfoLocal = {
  PHQ9: { title: 'Tingkat Stres' },
  SleepQuality: { title: 'Kualitas Tidur' },
  Lifestyle: { title: 'Gaya Hidup' },
};


export default function RiwayatDetailScreen({ route, navigation }) {
  const { assessmentId } = route.params;
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssessmentDetail = async () => {
      setIsLoading(true);
      try {
        // --- PERUBAHAN DI SINI ---
        // Tidak perlu: const db = await getDBConnection();
        
        // Langsung panggil tanpa argumen 'db'
        const result = await getAssessmentResultById(assessmentId); 
        // --------------------------
        setAssessment(result);
      } catch (error) {
        console.error("Failed to load assessment detail:", error);
        // Anda bisa menambahkan state untuk menampilkan pesan error di UI jika perlu
        setAssessment(null); // Set assessment ke null jika gagal load
      } finally {
        setIsLoading(false);
      }
    };

    if (assessmentId) {
      loadAssessmentDetail();
    } else {
      console.warn("RiwayatDetailScreen: assessmentId is undefined or null.");
      setIsLoading(false);
      setAssessment(null); // Pastikan assessment null jika ID tidak ada
    }
  }, [assessmentId]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#00796B" /></View>;
  }

  if (!assessment) {
    return <View style={styles.centered}><Text style={styles.errorText}>Gagal memuat detail riwayat atau data tidak ditemukan.</Text></View>;
  }

  const displayInfo = assessmentDisplayInfo[assessment.assessment_type] || { title: 'Detail Asesmen' };
  
  // Coba parsing detailsObject dengan aman
  let detailsObject = null;
  if (assessment.details) {
    try {
      detailsObject = JSON.parse(assessment.details);
    } catch (e) {
      console.error("Failed to parse assessment.details JSON:", e);
      // Biarkan detailsObject null jika parsing gagal
    }
  }


  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{displayInfo.title}</Text>
        <View style={{width: 24}} />{/* Placeholder untuk menyeimbangkan judul */}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Tipe Asesmen:</Text>
          {/* Menggunakan assessmentInfoLocal yang didefinisikan di file ini */}
          <Text style={styles.value}>{assessmentInfoLocal[assessment.assessment_type]?.title || assessment.assessment_type}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Tanggal:</Text>
          <Text style={styles.value}>{new Date(assessment.timestamp).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Skor:</Text>
          <Text style={styles.value}>{assessment.score}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Kategori:</Text>
          <Text style={[styles.value, styles.categoryValue]}>{assessment.category}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Saran:</Text>
          <Text style={styles.value}>{assessment.advice}</Text>
        </View>

        {/* Menampilkan 'detailsObject' (misalnya, jawaban individual) jika ada */}
        {detailsObject && Array.isArray(detailsObject) && ( // Pastikan detailsObject adalah array
            <View style={styles.card}>
            <Text style={styles.label}>Detail Jawaban (Skor per Pertanyaan):</Text>
            {detailsObject.map((answerScore, index) => (
                <Text key={index} style={styles.value}>
                Pertanyaan {index + 1}: {answerScore !== null ? answerScore : 'Tidak dijawab'}
                </Text>
            ))}
            </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  categoryValue: {
      fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
      fontSize: 16,
      color: 'red',
  }
});

// Objek assessmentInfo yang ada di bawah komentar dihapus karena sudah ada assessmentInfoLocal di atas.
// Jika Anda ingin berbagi assessmentInfo antar file, letakkan di file utilitas dan impor.