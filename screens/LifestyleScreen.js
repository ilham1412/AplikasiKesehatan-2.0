// screens/LifestyleScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getDBConnection, addAssessmentResult } from '../database/database.js'; // Jika ingin menyimpan hasil

// --- Definisi Pertanyaan dan Opsi untuk Gaya Hidup ---
// INI HANYA CONTOH, GANTI DENGAN PERTANYAAN & OPSI ANDA YANG SEBENARNYA
const lifestyleQuestions = [
  {
    id: 'LS1',
    text: "Seberapa sering Anda mengonsumsi buah dan sayuran (minimal 5 porsi) dalam sehari?",
    options: [
      { text: "Hampir setiap hari (5-7 hari/minggu)", value: 3 }, // Skor tertinggi untuk kebiasaan baik
      { text: "Sering (3-4 hari/minggu)", value: 2 },
      { text: "Kadang-kadang (1-2 hari/minggu)", value: 1 },
      { text: "Jarang atau tidak pernah", value: 0 },
    ],
  },
  {
    id: 'LS2',
    text: "Seberapa sering Anda melakukan aktivitas fisik/olahraga minimal 30 menit?",
    options: [
      { text: "5 kali atau lebih per minggu", value: 3 },
      { text: "3-4 kali per minggu", value: 2 },
      { text: "1-2 kali per minggu", value: 1 },
      { text: "Kurang dari sekali seminggu / tidak pernah", value: 0 },
    ],
  },
  {
    id: 'LS3',
    text: "Berapa rata-rata jam tidur Anda per malam?",
    options: [
      { text: "7-8 jam (Cukup)", value: 3 },
      { text: "6 jam", value: 2 },
      { text: "5 jam", value: 1 },
      { text: "Kurang dari 5 jam atau lebih dari 9 jam", value: 0 },
    ],
  },
  {
    id: 'LS4',
    text: "Seberapa sering Anda mengonsumsi minuman manis atau makanan cepat saji (junk food)?",
    options: [
      { text: "Jarang atau tidak pernah", value: 3 }, // Skor tertinggi untuk kebiasaan baik
      { text: "Kadang-kadang (1-2 kali/minggu)", value: 2 },
      { text: "Sering (3-4 kali/minggu)", value: 1 },
      { text: "Hampir setiap hari", value: 0 },
    ],
  },
  {
    id: 'LS5',
    text: "Bagaimana Anda menilai tingkat stres Anda secara umum dalam sebulan terakhir?",
    options: [
      { text: "Sangat rendah / terkendali", value: 3 },
      { text: "Rendah", value: 2 },
      { text: "Sedang", value: 1 },
      { text: "Tinggi / sangat tinggi", value: 0 },
    ],
  },
  // Tambahkan lebih banyak pertanyaan gaya hidup sesuai kebutuhan
];

// --- Fungsi Interpretasi Skor Gaya Hidup ---
// INI HANYA CONTOH, GANTI DENGAN SKEMA PENILAIAN ANDA
const getLifestyleCategoryAndAdvice = (score, totalQuestions = lifestyleQuestions.length) => {
  const maxPossibleScore = totalQuestions * 3; // Asumsi skor tertinggi per pertanyaan adalah 3
  const percentage = (score / maxPossibleScore) * 100;

  if (percentage >= 80) { // 80-100%
    return { category: 'Sangat Baik', advice: 'Gaya hidup Anda sangat baik! Pertahankan kebiasaan sehat ini untuk kesejahteraan jangka panjang.' };
  } else if (percentage >= 60) { // 60-79%
    return { category: 'Baik', advice: 'Gaya hidup Anda sudah cukup baik. Ada beberapa area kecil yang bisa ditingkatkan untuk hasil yang lebih optimal.' };
  } else if (percentage >= 40) { // 40-59%
    return { category: 'Cukup', advice: 'Gaya hidup Anda perlu beberapa perbaikan. Fokus pada peningkatan konsumsi makanan sehat, aktivitas fisik, dan manajemen stres.' };
  } else { // < 40%
    return { category: 'Perlu Perbaikan Signifikan', advice: 'Gaya hidup Anda memerlukan perhatian lebih. Sangat disarankan untuk membuat perubahan signifikan pada pola makan, aktivitas fisik, dan manajemen stres. Pertimbangkan untuk berkonsultasi dengan ahli gizi atau profesional kesehatan.' };
  }
};


export default function LifestyleScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(lifestyleQuestions.length).fill(null));
  const [selectedOptionValue, setSelectedOptionValue] = useState(null);

  const currentQuestion = lifestyleQuestions[currentQuestionIndex];

  useEffect(() => {
    setSelectedOptionValue(answers[currentQuestionIndex]);
  }, [currentQuestionIndex, answers]);

  const handleSelectOption = (optionValue) => {
    setSelectedOptionValue(optionValue);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionValue;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((acc, val) => acc + (val !== null ? val : 0), 0);
  };

  const handleLanjutkan = async () => { // Jadikan async jika akan menyimpan ke DB
    if (selectedOptionValue === null && answers[currentQuestionIndex] === null) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi sebelum melanjutkan.");
      return;
    }

    if (currentQuestionIndex < lifestyleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const score = calculateScore();
      const { category, advice } = getLifestyleCategoryAndAdvice(score, lifestyleQuestions.length);

      // // Simpan ke database (Uncomment dan sesuaikan jika perlu)
      // try {
      //   // const db = await getDBConnection(); // Tidak perlu jika addAssessmentResult memanggilnya internal
      //   await addAssessmentResult(
      //     'Lifestyle', // Tipe asesmen
      //     score,
      //     category,
      //     advice,
      //     JSON.stringify(answers) // Simpan jawaban individual
      //   );
      //   console.log('Lifestyle result saved to database.');
      // } catch (error) {
      //   console.error('Failed to save Lifestyle result:', error);
      //   Alert.alert('Error', 'Gagal menyimpan hasil tes ke database.');
      // }

      navigation.navigate('LifestyleResult', { // Buat screen LifestyleResult
        score,
        category,
        advice,
        answers: answers,
      });
    }
  };

  const handleKembali = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const progress = ((currentQuestionIndex + 1) / lifestyleQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleKembali} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${progress}%` }]} />
        </View>
        <View style={{width: 28}} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.value} // Pastikan value unik per set opsi pertanyaan
              style={[
                styles.optionItem,
                selectedOptionValue === option.value && styles.optionItemSelected
              ]}
              onPress={() => handleSelectOption(option.value)}
            >
              <Text 
                style={[
                  styles.optionText, 
                  selectedOptionValue === option.value && styles.optionTextSelected
                ]}
              >
                {option.text}
              </Text>
              <View 
                style={[
                  styles.checkboxBase, 
                  selectedOptionValue === option.value && styles.checkboxChecked
                ]}
              >
                {selectedOptionValue === option.value && (
                  <Icon name="check" size={16} color="#00695C" /> // Warna check disesuaikan
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.spacer} /> 
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
            style={[styles.actionButton, (selectedOptionValue === null && answers[currentQuestionIndex] === null) && styles.disabledButton]} 
            onPress={handleLanjutkan}
            disabled={(selectedOptionValue === null && answers[currentQuestionIndex] === null)}
        >
          <Text style={styles.actionButtonText}>
            {currentQuestionIndex === lifestyleQuestions.length - 1 ? 'Lihat Hasil' : 'Lanjutkan'}
          </Text>
          <Icon name="arrow-right" size={20} color="white" style={{marginLeft: 8}}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles (sama persis dengan PHQ9Screen.js yang sudah Anda sesuaikan)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F4F6F8', 
  },
  backButton: {
    padding: 5, 
  },
  progressBarOuter: {
    flex: 1, 
    height: 8, 
    backgroundColor: '#E0E0E0', 
    borderRadius: 4,
    marginHorizontal: 15, 
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#00695C', 
    borderRadius: 4,
  },
  scrollView: {
    flex: 1, 
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20, 
    paddingBottom: 20, 
  },
  questionText: {
    fontSize: 22, 
    fontWeight: '600', 
    color: '#263238', 
    marginBottom: 30, 
    lineHeight: 30,
  },
  optionsContainer: {
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12, 
    marginBottom: 12, 
    borderWidth: 1,
    borderColor: '#E0E0E0', 
  },
  optionItemSelected: {
    backgroundColor: '#00695C', 
    borderColor: '#00695C',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1, 
  },
  optionTextSelected: {
    color: '#FFFFFF', 
    fontWeight: '500',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 4, 
    borderWidth: 2,
    borderColor: '#B0BEC5', 
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF', 
    borderColor: '#FFFFFF', 
  },
  spacer: { 
    flex: 1,
  },
  bottomButtonContainer: { 
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#F4F6F8', 
    borderTopWidth: 1, 
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    backgroundColor: '#00695C', 
    paddingVertical: 16,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', 
    marginBottom:35,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', 
  },
});