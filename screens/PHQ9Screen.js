// screens/PHQ9Screen.js
import React, { useState, useEffect } from 'react'; // PASTIKAN useEffect ADA DI SINI
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar, // Impor StatusBar
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Untuk ikon

// Daftar pertanyaan PHQ-9 (tetap sama)
const questions = [
  "Sedikit berminat atau senang dalam melakukan sesuatu?", // Hapus nomor agar lebih fleksibel
  "Merasa murung, sedih, atau putus asa?",
  "Sulit tidur atau tidur terlalu banyak?",
  "Merasa lelah atau kurang bertenaga?",
  "Nafsu makan berkurang atau berlebihan?",
  "Merasa buruk tentang diri sendiri — atau bahwa Anda adalah seorang yang gagal atau telah mengecewakan diri sendiri atau keluarga Anda?",
  "Sulit berkonsentrasi pada sesuatu, seperti membaca koran atau menonton televisi?",
  "Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikannya? Atau sebaliknya — merasa resah atau gelisah sehingga Anda lebih sering bergerak dari biasanya?",
  "Berpikir bahwa akan lebih baik jika Anda mati, atau ingin menyakiti diri sendiri dengan cara apapun?",
];

// Opsi jawaban dari gambar Anda (Selalu, Biasanya, Kadang-kadang, Tidak pernah)
// Kita akan tetap menggunakan skor 0-3 atau 0-4 seperti sebelumnya untuk PHQ-9
// Di sini saya akan menggunakan teks dari gambar, dan Anda bisa mapping nilainya
// Jika tetap ingin 5 opsi PHQ-9 sebelumnya, kita bisa sesuaikan UI pilihan ini
const phq9OptionsNewUI = [
  // Gambar Anda memiliki 4 opsi, PHQ-9 standar juga 4 opsi skor 0-3
  // Saya akan gunakan 4 opsi yang umum untuk PHQ-9 dengan skor 0-3
  { text: "Tidak pernah sama sekali", value: 0 },
  { text: "Beberapa hari", value: 1 },
  { text: "Lebih dari separuh hari", value: 2 },
  { text: "Hampir setiap hari", value: 3 },
];
// Jika Anda ingin menggunakan 5 opsi dari kode lama:
// const phq9OptionsNewUI = [
//   { text: "Tidak Pernah", value: 0 },
//   { text: "Beberapa Hari", value: 1 },
//   { text: "Cukup Sering", value: 2 }, // Ini opsi ke-5 dari kode lama Anda
//   { text: "Lebih dari Separuh Hari", value: 3 }, // Skornya jadi 0-4
//   { text: "Hampir Setiap Hari", value: 4 },
// ];


// Fungsi getCategoryAndAdvice perlu disesuaikan jika jumlah skor maksimal berubah
// Jika menggunakan 4 opsi (skor 0-3), skor maksimal adalah 9*3 = 27
// Jika menggunakan 5 opsi (skor 0-4), skor maksimal adalah 9*4 = 36
const getCategoryAndAdvice = (score, totalPossibleScore = 27) => { // Sesuaikan totalPossibleScore
    // Logika ini mungkin perlu penyesuaian lebih lanjut berdasarkan standar PHQ-9
    // dengan 4 atau 5 opsi dan rentang skornya.
    // Saya akan gunakan logika dari kode Anda sebelumnya, pastikan ini sesuai.
    if (score <= 4) {
        return { category: 'Minimal atau Tidak Ada Gejala', advice: 'Tidak ditemukan gejala depresi yang signifikan. Tetap jaga gaya hidup sehat.'};
    } else if (score <= 9) {
        return { category: 'Ringan', advice: 'Gejala depresi ringan terdeteksi. Pertimbangkan untuk memantau suasana hati Anda dan melakukan aktivitas yang menyenangkan.'};
    } else if (score <= 14) {
        return { category: 'Sedang', advice: 'Gejala depresi sedang terdeteksi. Disarankan untuk berbicara dengan teman, keluarga, atau mempertimbangkan konsultasi dengan profesional.'};
    } else if (score <= 19) { // Ini mungkin perlu disesuaikan jika skor maks 36
        return { category: 'Sedang-Berat', advice: 'Gejala depresi sedang hingga berat. Sangat disarankan untuk mencari bantuan profesional kesehatan mental.'};
    } else {
        return { category: 'Berat', advice: 'Gejala depresi berat terdeteksi. Segera konsultasikan dengan profesional kesehatan mental untuk mendapatkan bantuan dan penanganan lebih lanjut.'};
    }
};


export default function PHQ9Screen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [selectedOptionValue, setSelectedOptionValue] = useState(null);

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

  const handleLanjutkan = () => {
    if (selectedOptionValue === null && answers[currentQuestionIndex] === null) { // Pastikan jawaban saat ini dipilih
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi sebelum melanjutkan.");
      return;
    }

    // Pastikan jawaban untuk pertanyaan saat ini sudah tersimpan di 'answers'
    // (Seharusnya sudah dilakukan di handleSelectOption)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // setSelectedOptionValue(null); // Reset pilihan untuk pertanyaan berikutnya, sudah dihandle useEffect
    } else {
      // Pertanyaan terakhir, submit
      const score = calculateScore();
      // Sesuaikan totalPossibleScore jika Anda menggunakan 5 opsi (0-4) -> 9*4 = 36
      // Untuk 4 opsi (0-3) -> 9*3 = 27
      const { category, advice } = getCategoryAndAdvice(score, phq9OptionsNewUI.length === 5 ? 36 : 27);

      navigation.navigate('PHQ9Result', {
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
      // setSelectedOptionValue(answers[currentQuestionIndex - 1]); // Sudah dihandle useEffect
    } else {
      navigation.goBack(); // Kembali ke layar sebelumnya jika ini pertanyaan pertama
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionText = questions[currentQuestionIndex];

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
        <Text style={styles.questionText}>{currentQuestionText}</Text>

        <View style={styles.optionsContainer}>
          {phq9OptionsNewUI.map((option) => (
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
                  <Icon name="check" size={16} color="#508E82" />
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
            {currentQuestionIndex === questions.length - 1 ? 'Lihat Hasil' : 'Lanjutkan'}
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
    backgroundColor: '#F4F6F8', // Latar belakang utama layar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Untuk menyeimbangkan tombol kembali dan placeholder
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F4F6F8', // Samakan dengan latar utama atau buat transparan
  },
  backButton: {
    padding: 5, // Area sentuh
  },
  progressBarOuter: {
    flex: 1, // Agar progress bar mengambil ruang tengah yang tersedia
    height: 8, // Tinggi progress bar
    backgroundColor: '#E0E0E0', // Warna track progress bar
    borderRadius: 4,
    marginHorizontal: 15, // Jarak dari tombol kembali dan placeholder
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#00695C', // Warna isi progress bar (hijau tua)
    borderRadius: 4,
  },
  scrollView: {
    flex: 1, // ScrollView mengambil sisa ruang
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20, // Jarak dari progress bar ke teks pertanyaan
    paddingBottom: 20, // Jarak dari opsi terakhir ke tombol lanjutkan (jika tombol di dalam scroll)
    // justifyContent: 'space-between', // Hapus jika tombol lanjutkan di luar scrollview
  },
  questionText: {
    fontSize: 22, // Ukuran font pertanyaan lebih besar
    fontWeight: '600', // Sedikit tebal
    color: '#263238', // Warna teks pertanyaan (gelap)
    marginBottom: 30, // Jarak ke opsi jawaban
    lineHeight: 30,
  },
  optionsContainer: {
    // Tidak perlu style khusus jika item sudah di-styling
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Latar belakang opsi putih
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12, // Sudut membulat
    marginBottom: 12, // Jarak antar opsi
    borderWidth: 1,
    borderColor: '#E0E0E0', // Border tipis
  },
  optionItemSelected: {
    backgroundColor: '#00695C', // Warna latar opsi terpilih (hijau tua)
    borderColor: '#00695C',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1, // Agar teks mengambil ruang yang tersedia
  },
  optionTextSelected: {
    color: '#FFFFFF', // Teks putih saat terpilih
    fontWeight: '500',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 4, // Kotak, bukan lingkaran
    borderWidth: 2,
    borderColor: '#B0BEC5', // Warna border checkbox tidak terpilih
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF', // Latar checkbox putih saat terpilih (agar ikon check terlihat)
    borderColor: '#FFFFFF', // Border putih
  },
  spacer: { // Untuk mendorong tombol ke bawah jika tombol di dalam ScrollView
    flex: 1,
  },
  bottomButtonContainer: { // Container untuk tombol Lanjutkan agar selalu di bawah
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#F4F6F8', // Samakan dengan latar utama atau buat transparan
    borderTopWidth: 1, // Opsional: garis pemisah tipis di atas tombol
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    backgroundColor: '#00695C', // Warna tombol (hijau tua)
    paddingVertical: 16,
    borderRadius: 25, // Sudut membulat penuh
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Untuk ikon dan teks
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', // Warna tombol saat disabled
  },
});
