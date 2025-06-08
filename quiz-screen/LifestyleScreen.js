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

// --- Definisi Pertanyaan & Opsi yang Diringkas untuk Gaya Hidup ---
// Setiap opsi diberi nilai score dari 0 (paling buruk/tidak sehat) sampai 4 (paling baik/sehat).
// Pertanyaan dan opsi disarikan dari "Fantastic Lifestyle Checklist" PDF.
const lifestyleQuestions = [
  {
    id: 'LS_FF1',
    text: "Dalam sebulan terakhir, seberapa sering Anda merasa memiliki seseorang untuk diajak bicara dan Anda memberi/menerima kasih sayang?",
    options: [
      { text: "Hampir tidak pernah", value: 0 },
      { text: "Jarang", value: 1 },
      { text: "Kadang-kadang", value: 2 },
      { text: "Cukup sering", value: 3 },
      { text: "Hampir selalu", value: 4 },
    ],
  },
  {
    id: 'LS_ACT1',
    text: "Dalam sebulan terakhir, seberapa sering Anda aktif secara fisik (misalnya olahraga berat 30 menit, atau aktivitas sedang seperti berjalan/berkebun) ?",
    options: [
      { text: "Kurang dari 3 kali seminggu", value: 0 },
      { text: "3 kali seminggu", value: 1 }, // Asumsi 3x/minggu sudah cukup baik untuk dasar
      { text: "4 kali seminggu", value: 2 },
      { text: "5 kali seminggu", value: 3 },
      { text: "Lebih dari 5 kali seminggu", value: 4 },
    ],
  },
  {
    id: 'LS_NUT1',
    text: "Dalam sebulan terakhir, seberapa sering Anda makan makanan yang seimbang (sesuai panduan gizi)?",
    options: [
      { text: "Hampir tidak pernah", value: 0 },
      { text: "Jarang", value: 1 },
      { text: "Kadang-kadang", value: 2 },
      { text: "Cukup sering", value: 3 },
      { text: "Hampir selalu", value: 4 },
    ],
  },
  {
    id: 'LS_TOX1',
    text: "Dalam sebulan terakhir, seberapa sering Anda mengonsumsi gula berlebih, garam berlebih, lemak hewani, atau makanan cepat saji?",
    options: [
      { text: "Hampir setiap hari (4 kategori)", value: 0 }, // Paling buruk
      { text: "Sering (2-3 kategori)", value: 1 },
      { text: "Kadang-kadang (1 kategori)", value: 2 },
      { text: "Jarang/Tidak sama sekali", value: 4 }, // Paling baik
    ],
  },
  {
    id: 'LS_TOX2',
    text: "Dalam sebulan terakhir, seberapa sering Anda menggunakan tembakau, narkoba (seperti ganja/kokain), atau obat resep/bebas secara berlebihan?",
    options: [
      { text: "Sering menggunakan lebih dari satu", value: 0 }, // Paling buruk
      { text: "Kadang-kadang menggunakan satu", value: 1 },
      { text: "Jarang menggunakan satu", value: 2 },
      { text: "Hampir tidak pernah menggunakan", value: 3 },
      { text: "Tidak pernah menggunakan", value: 4 }, // Paling baik
    ],
  },
  {
    id: 'LS_ALC1',
    text: "Dalam sebulan terakhir, bagaimana asupan alkohol Anda per minggu atau per kesempatan?",
    options: [
      { text: "Lebih dari 20 minuman/minggu atau >4 minuman sering", value: 0 }, // Paling buruk
      { text: "13-20 minuman/minggu atau >4 minuman kadang-kadang", value: 1 },
      { text: "8-12 minuman/minggu atau >4 minuman jarang", value: 2 },
      { text: "0-7 minuman/minggu dan jarang >4 minuman", value: 3 },
      { text: "Tidak minum alkohol sama sekali", value: 4 }, // Paling baik
    ],
  },
  {
    id: 'LS_SLP1',
    text: "Dalam sebulan terakhir, seberapa sering Anda tidur nyenyak dan merasa segar?",
    options: [
      { text: "Hampir tidak pernah", value: 0 },
      { text: "Jarang", value: 1 },
      { text: "Kadang-kadang", value: 2 },
      { text: "Cukup sering", value: 3 },
      { text: "Hampir selalu", value: 4 },
    ],
  },
  {
    id: 'LS_STB1',
    text: "Dalam sebulan terakhir, seberapa sering Anda menggunakan sabuk pengaman?",
    options: [
      { text: "Tidak pernah", value: 0 },
      { text: "Jarang", value: 1 },
      { text: "Kadang-kadang", value: 2 },
      { text: "Sering", value: 3 },
      { text: "Selalu", value: 4 },
    ],
  },
  {
    id: 'LS_STR1',
    text: "Dalam sebulan terakhir, seberapa sering Anda mampu mengatasi stres dalam hidup dan menikmati waktu luang?",
    options: [
      { text: "Hampir tidak pernah", value: 0 },
      { text: "Jarang", value: 1 },
      { text: "Kadang-kadang", value: 2 },
      { text: "Cukup sering", value: 3 },
      { text: "Hampir selalu", value: 4 },
    ],
  },
  {
    id: 'LS_BEH1',
    text: "Dalam sebulan terakhir, seberapa sering Anda merasa terburu-buru, marah/bermusuhan, atau tegang/cemas?",
    options: [
      { text: "Hampir selalu (3 kategori)", value: 0 }, // Paling buruk
      { text: "Sering (2-3 kategori)", value: 1 },
      { text: "Kadang-kadang (1 kategori)", value: 2 },
      { text: "Jarang/Tidak sama sekali", value: 4 }, // Paling baik
    ],
  },
  {
    id: 'LS_INS1',
    text: "Dalam sebulan terakhir, seberapa sering Anda adalah pemikir yang positif/optimis dan tidak merasa sedih/depresi?",
    options: [
      { text: "Hampir tidak pernah positif dan sering depresi", value: 0 }, // Paling buruk
      { text: "Jarang positif dan kadang depresi", value: 1 },
      { text: "Kadang-kadang positif dan jarang depresi", value: 2 },
      { text: "Cukup sering positif dan hampir tidak pernah depresi", value: 3 },
      { text: "Hampir selalu positif dan tidak pernah depresi", value: 4 }, // Paling baik
    ],
  },
  {
    id: 'LS_CAR1',
    text: "Dalam sebulan terakhir, seberapa puas Anda dengan pekerjaan atau peran Anda?",
    options: [
      { text: "Hampir tidak pernah", value: 0 },
      { text: "Jarang", value: 1 },
      { text: "Kadang-kadang", value: 2 },
      { text: "Cukup sering", value: 3 },
      { text: "Hampir selalu", value: 4 },
    ],
  },
];


// --- Fungsi Interpretasi Skor Gaya Hidup (Disesuaikan untuk Pertanyaan Diringkas) ---
const getLifestyleCategoryAndAdvice = (score, totalQuestions = lifestyleQuestions.length) => {
  const maxPossibleScore = totalQuestions * 4;
  const percentage = (score / maxPossibleScore) * 100;

  if (percentage >= 85) { // 85-100%
    return { category: 'EXCELLENT', advice: 'Gaya hidup Anda sangat baik! Pertahankan kebiasaan sehat ini untuk kesejahteraan jangka panjang. Teruslah bekerja keras untuk mencapai gaya hidup yang lebih baik.' }; // <--- Pastikan string 'advice' ini lengkap dan ditutup dengan benar
  } else if (percentage >= 70) { // 70-84%
    return { category: 'VERY GOOD', advice: 'Gaya hidup Anda sudah sangat baik. Teruslah berusaha untuk mencapai keunggulan. Ada beberapa area kecil yang bisa ditingkatkan untuk hasil yang lebih optimal.' };
  } else if (percentage >= 55) { // 55-69%
    return { category: 'GOOD', advice: 'Gaya hidup Anda baik. Ada beberapa area yang bisa Anda tingkatkan. Perhatikan area-area di mana Anda mendapat skor rendah.' };
  } else if (percentage >= 35) { // 35-54%
    return { category: 'FAIR', advice: 'Gaya hidup Anda perlu beberapa perbaikan. Fokus pada peningkatan konsumsi makanan sehat, aktivitas fisik, dan manajemen stres. Mulailah dengan langkah kecil.' };
  } else { // 0-34%
    return { category: 'NEEDS IMPROVEMENT', advice: 'Gaya hidup Anda memerlukan perbaikan yang serius. Sangat disarankan untuk membuat perubahan signifikan pada pola makan, aktivitas fisik, dan manajemen stres. Pertimbangkan untuk berkonsultasi dengan ahli gizi atau profesional kesehatan. Ingat, selalu ada kesempatan untuk mengubah gaya hidup Anda - mulai sekarang.' };
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
    // Menghitung skor total berdasarkan nilai yang ditetapkan di 'value' setiap opsi
    return answers.reduce((acc, val) => acc + (val !== null ? val : 0), 0);
  };

  const handleLanjutkan = () => {
    if (selectedOptionValue === null && answers[currentQuestionIndex] === null) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi sebelum melanjutkan.");
      return;
    }

    if (currentQuestionIndex < lifestyleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Pertanyaan terakhir, submit
      const score = calculateScore();
      const { category, advice } = getLifestyleCategoryAndAdvice(score, lifestyleQuestions.length);

      navigation.navigate('LifestyleResult', {
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
              key={option.value}
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
                  <Icon name="check" size={16} color="#00695C" />
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