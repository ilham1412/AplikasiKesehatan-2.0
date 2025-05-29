import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, Platform,
  ScrollView // Tambahkan ScrollView
} from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Gunakan jika navigation tidak di-pass sebagai prop

// Daftar pertanyaan PHQ-9 (tetap sama)
const questions = [
  "1. Sedikit berminat atau senang dalam melakukan sesuatu?",
  "2. Merasa murung, sedih, atau putus asa?",
  "3. Sulit tidur atau tidur terlalu banyak?",
  "4. Merasa lelah atau kurang bertenaga?",
  "5. Nafsu makan berkurang atau berlebihan?",
  "6. Merasa buruk tentang diri sendiri — atau bahwa Anda adalah seorang yang gagal atau telah mengecewakan diri sendiri atau keluarga Anda?",
  "7. Sulit berkonsentrasi pada sesuatu, seperti membaca koran atau menonton televisi?",
  "8. Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikannya? Atau sebaliknya — merasa resah atau gelisah sehingga Anda lebih sering bergerak dari biasanya?",
  "9. Berpikir bahwa akan lebih baik jika Anda mati, atau ingin menyakiti diri sendiri dengan cara apapun?",
];

// Opsi jawaban baru dengan 5 pilihan (skor 0-4)
const phq9FiveOptions = [
  { text: "Tidak Pernah", value: 0 },
  { text: "Beberapa Hari", value: 1 },
  { text: "Cukup Sering", value: 2 },
  { text: "Lebih dari Separuh Hari", value: 3 },
  { text: "Hampir Setiap Hari", value: 4 },
];

// !!! PENTING: Fungsi ini HARUS disesuaikan dengan rentang skor baru (0-36) jika belum !!!
const getCategoryAndAdvice = (score) => {
  if (score <= 4) {
    return {
      category: 'Minimal atau Tidak Ada Gejala',
      advice: 'Tidak ditemukan gejala depresi yang signifikan. Tetap jaga gaya hidup sehat.',
    };
  } else if (score <= 9) {
    return {
      category: 'Ringan',
      advice: 'Gejala depresi ringan terdeteksi. Pertimbangkan untuk memantau suasana hati Anda dan melakukan aktivitas yang menyenangkan.',
    };
  } else if (score <= 14) {
    return {
      category: 'Sedang',
      advice: 'Gejala depresi sedang terdeteksi. Disarankan untuk berbicara dengan teman, keluarga, atau mempertimbangkan konsultasi dengan profesional.',
    };
  } else if (score <= 19) {
     return {
      category: 'Sedang-Berat',
      advice: 'Gejala depresi sedang hingga berat. Sangat disarankan untuk mencari bantuan profesional kesehatan mental.',
    };
  }
  else {
    return {
      category: 'Berat',
      advice: 'Gejala depresi berat terdeteksi. Segera konsultasikan dengan profesional kesehatan mental untuk mendapatkan bantuan dan penanganan lebih lanjut.',
    };
  }
};

export default function PHQ9Screen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleSelectOption = (optionValue) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionValue;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((acc, val) => acc + (val !== null ? val : 0), 0);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex] === null) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi sebelum melanjutkan.");
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers[currentQuestionIndex] === null) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi untuk pertanyaan terakhir.");
      return;
    }

    const score = calculateScore();
    const { category, advice } = getCategoryAndAdvice(score);

    navigation.navigate('PHQ9Result', {
      score,
      category,
      advice,
      answers: answers,
    });
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Ganti View utama dengan ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled" // Baik untuk interaksi di dalam ScrollView
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        {/* Question Area */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionHeader}>Pertanyaan {currentQuestionIndex + 1}:</Text>
          <Text style={styles.questionText}>{questions[currentQuestionIndex].substring(questions[currentQuestionIndex].indexOf('.') + 2)}</Text>
        </View>

        {/* Options Area */}
        <View style={styles.optionsListContainer}>
          {phq9FiveOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={() => handleSelectOption(option.value)}
            >
              <View style={[
                styles.radioCircle,
                answers[currentQuestionIndex] === option.value && styles.radioCircleSelected
              ]}>
                {answers[currentQuestionIndex] === option.value && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bagian ini sengaja dibuat agar ada ruang yang cukup untuk tombol navigasi di bawah
            jika kontennya lebih pendek dari layar.
            Jika kontennya panjang dan bisa di-scroll, ini akan mendorong tombol ke bawah.
        */}
        <View style={styles.spacer} /> 

        {/* Navigation Buttons */}
        <View style={styles.navigationButtonsContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={handlePreviousQuestion}>
              <Text style={[styles.navButtonText, styles.prevButtonText]}>Kembali</Text>
            </TouchableOpacity>
          )}
          {/* Placeholder untuk menjaga layout jika tombol kembali tidak ada */}
          {currentQuestionIndex === 0 && <View style={styles.buttonPlaceholder} />} 
          <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNextQuestion}>
            <Text style={[styles.navButtonText, styles.nextButtonText]}>
              {currentQuestionIndex === questions.length - 1 ? 'Lihat Hasil' : 'Berikutnya'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  // Style untuk ScrollView itu sendiri
  scrollView: {
    flex: 1, // ScrollView mengambil sisa ruang di SafeAreaView
  },
  // Style untuk konten di dalam ScrollView
  scrollContentContainer: {
    flexGrow: 1, // Penting agar justifyContent bekerja jika konten lebih pendek dari layar
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 20, // Padding bawah untuk konten
    justifyContent: 'flex-start', // Mulai konten dari atas
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4DB6AC',
    borderRadius: 5,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionHeader: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsListContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical:15,
    marginBottom: 20, // Beri jarak sebelum spacer/tombol
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center', // Ditambahkan untuk memastikan innerCircle di tengah
    justifyContent: 'center', // Ditambahkan untuk memastikan innerCircle di tengah
  },
  radioCircleSelected: {
    borderColor: '#4DB6AC',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4DB6AC',
  },
  optionText: {
    fontSize: 17,
    color: '#424242',
    marginLeft: 15, // Sesuaikan jarak dari radio button
  },
  // Spacer untuk mendorong tombol ke bawah jika konten pendek
  spacer: {
    flex: 1, // Mengambil sisa ruang vertikal yang tersedia
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Jarak dari konten di atasnya atau spacer
    paddingHorizontal: 10, // Padding horizontal yang sudah ada
  },
  buttonPlaceholder: { // Untuk menggantikan tombol 'Kembali' agar layout 'space-between' tetap bekerja
    minWidth: 120, // Sesuaikan dengan minWidth tombol navButton
    // backgroundColor: 'transparent', // Tidak terlihat
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  prevButton: {
    backgroundColor: '#E0E0E0',
  },
  prevButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4DB6AC',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});