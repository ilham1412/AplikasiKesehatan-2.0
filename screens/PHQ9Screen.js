import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
// Sesuaikan teks jika perlu
const phq9FiveOptions = [
  { text: "Tidak Pernah", value: 0 },
  { text: "Beberapa Hari", value: 1 },
  { text: "Cukup Sering", value: 2 },
  { text: "Lebih dari Separuh Hari", value: 3 },
  { text: "Hampir Setiap Hari", value: 4 },
];

// !!! PENTING: Fungsi ini HARUS disesuaikan dengan rentang skor baru (0-36) !!!
// Kategori dan saran saat ini mungkin tidak akurat.
const getCategoryAndAdvice = (score) => {
  // Contoh penyesuaian (ANDA HARUS MEMVERIFIKASI DAN MENYESUAIKAN INI):
  // Skor maksimal baru adalah 9 * 4 = 36
  if (score <= 4) { // Misalnya, 0-4 tetap minimal
    return {
      category: 'Minimal atau Tidak Ada Gejala',
      advice: 'Tidak ditemukan gejala depresi yang signifikan. Tetap jaga gaya hidup sehat.',
    };
  } else if (score <= 9) { // Misalnya, 5-9 tetap ringan
    return {
      category: 'Ringan',
      advice: 'Gejala depresi ringan terdeteksi. Pertimbangkan untuk memantau suasana hati Anda dan melakukan aktivitas yang menyenangkan.',
    };
  } else if (score <= 14) { // Misalnya, 10-14 tetap sedang
    return {
      category: 'Sedang',
      advice: 'Gejala depresi sedang terdeteksi. Disarankan untuk berbicara dengan teman, keluarga, atau mempertimbangkan konsultasi dengan profesional.',
    };
  } else if (score <= 19) { // Misalnya, 15-19 menjadi sedang-berat
     return {
      category: 'Sedang-Berat',
      advice: 'Gejala depresi sedang hingga berat. Sangat disarankan untuk mencari bantuan profesional kesehatan mental.',
    };
  }
  else { // Misalnya, >19 menjadi berat
    return {
      category: 'Berat',
      advice: 'Gejala depresi berat terdeteksi. Segera konsultasikan dengan profesional kesehatan mental untuk mendapatkan bantuan dan penanganan lebih lanjut.',
    };
  }
};

export default function PHQ9ScreenModified() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const navigation = useNavigation();

  const handleSelectOption = (optionValue) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionValue;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex] === null) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi sebelum melanjutkan.");
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Ini adalah pertanyaan terakhir, tombol "Berikutnya" akan berfungsi sebagai "Submit"
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return answers.reduce((acc, val) => acc + (val !== null ? val : 0), 0);
  };

  const handleSubmit = () => {
    // Periksa apakah semua pertanyaan telah dijawab (meskipun handleNextQuestion sudah memeriksa per langkah)
    const allAnswered = answers.every(answer => answer !== null);
    if (!allAnswered && answers[currentQuestionIndex] === null) { // Cek juga pertanyaan saat ini jika itu yg terakhir
        Alert.alert("Peringatan", "Harap jawab semua pertanyaan sebelum submit.");
        return;
    }
     if (answers[currentQuestionIndex] === null) { // Pastikan pertanyaan terakhir dijawab
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi untuk pertanyaan terakhir.");
      return;
    }


    const score = calculateScore();
    const { category, advice } = getCategoryAndAdvice(score);

    navigation.navigate('PHQ9Result', { // Pastikan Anda memiliki screen bernama 'PHQ9Result'
      score,
      category,
      advice,
    });
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        {/* Navigation Buttons */}
        <View style={styles.navigationButtonsContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={handlePreviousQuestion}>
              <Text style={[styles.navButtonText, styles.prevButtonText]}>Kembali</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNextQuestion}>
            <Text style={[styles.navButtonText, styles.nextButtonText]}>
              {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Berikutnya'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Latar belakang keseluruhan yang sangat terang
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0, // Padding atas untuk Android
    justifyContent: 'space-between', // Mendorong tombol navigasi ke bawah
    paddingBottom: 20,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0', // Warna track progress bar
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4DB6AC', // Warna isi progress bar (teal)
    borderRadius: 5,
  },
  questionContainer: {
    backgroundColor: 'white', // Latar belakang area pertanyaan
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
    color: '#757575', // Warna abu-abu untuk "Pertanyaan X:"
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#333', // Warna teks pertanyaan utama
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsListContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical:15,
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
    // borderBottomWidth: 1, // Garis pemisah antar opsi jika diinginkan
    // borderBottomColor: '#EEEEEE',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BDBDBD', // Warna border radio button tidak terpilih
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  radioCircleSelected: {
    borderColor: '#4DB6AC', // Warna border radio button terpilih (teal)
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4DB6AC', // Warna isi radio button terpilih (teal)
  },
  optionText: {
    fontSize: 17,
    color: '#424242',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Tombol "Kembali" di kiri, "Berikutnya" di kanan
    marginTop: 30,
    paddingHorizontal: 10, // Padding agar tombol tidak terlalu mepet tepi
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, // Membuat tombol lebih rounded
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120, // Lebar minimum tombol
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
    backgroundColor: '#E0E0E0', // Warna tombol kembali
  },
  prevButtonText: {
    color: '#757575', // Warna teks tombol kembali
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4DB6AC', // Warna tombol berikutnya/submit (teal)
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

