// screens/PSQIScreen.js
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

const psqiQuestions = [
  // Untuk contoh ini, kita fokus pada Q4 dengan UI angka besar.
  // Anda perlu menambahkan pertanyaan lain dengan struktur serupa.
  {
    id: 'Q4',
    text: "Dalam sebulan terakhir, berapa jam tidur malam yang benar-benar Anda dapatkan?",
    subtext: "*(ini mungkin berbeda dari jumlah jam yang Anda habiskan di tempat tidur.)*",
    type: 'number_picker', // Tipe input khusus untuk UI angka besar
    options: { min: 0, max: 12, step: 0.5, unit: 'jam' }, // Pengaturan untuk number picker
    // Skor untuk DURATION OF SLEEP (PSQIDURAT) 
    // >=7 jam -> skor 0
    // <7 dan >=6 jam -> skor 1
    // <6 dan >=5 jam -> skor 2
    // <5 jam -> skor 3
    // Kita akan menyimpan jawaban mentah dulu, scoring dilakukan di akhir
  },
  {
    id: 'Q5a',
    text: "Dalam sebulan terakhir, seberapa sering Anda kesulitan tidur karena TIDAK BISA TIDUR DALAM 30 MENIT?",
    type: 'single_choice',
    options: [
      { text: "Tidak pernah selama sebulan terakhir", value: 0 },
      { text: "Kurang dari sekali seminggu", value: 1 },
      { text: "Sekali atau dua kali seminggu", value: 2 },
      { text: "Tiga kali atau lebih seminggu", value: 3 },
    ],
  },
  {
    id: 'Q6',
    text: "Dalam sebulan terakhir, bagaimana Anda menilai KUALITAS TIDUR Anda secara keseluruhan?",
    type: 'single_choice',
    options: [
      { text: "Sangat baik", value: 0 },
      { text: "Cukup baik", value: 1 },
      { text: "Cukup buruk", value: 2 },
      { text: "Sangat buruk", value: 3 },
    ],
  },
  // ... Tambahkan pertanyaan PSQI lainnya (Q1, Q2, Q3, Q5b-j, Q7, Q8, Q9)
  // dengan tipe 'single_choice', 'time_input', atau 'number_input' sesuai kebutuhan.
];


// --- Fungsi Perhitungan Skor PSQI ---
// Ini akan menjadi fungsi yang kompleks berdasarkan PDF scoring
const calculatePSQIScoreAndCategory = (answers) => {
  let scoreDurat = 0;
  let scoreDistb = 0;
  let scoreLaten = 0;
  let scoreDaydys = 0;
  let scoreHse = 0; // Sleep Efficiency
  let scoreSlpqual = 0;
  let scoreMeds = 0;

  // 1. PSQIDURAT (Durasi Tidur) - Berdasarkan jawaban Q4 
  const actualSleepHours = answers['Q4']; // Jawaban mentah dari Q4
  if (actualSleepHours >= 7) scoreDurat = 0;
  else if (actualSleepHours >= 6) scoreDurat = 1;
  else if (actualSleepHours >= 5) scoreDurat = 2;
  else if (actualSleepHours < 5) scoreDurat = 3;
  else scoreDurat = 0; // Default jika tidak ada jawaban (perlu penanganan lebih baik)


  // 2. PSQIDISTB (Gangguan Tidur) - Berdasarkan Q5b sampai Q5j 
  // Skor Q5b s/d Q5j adalah 0-3. Jumlahkan semua.
  // Jika Q5j atau komentarnya null, Q5j = 0.
  let sumQ5b_j = 0;
  const q5Items = ['Q5b', 'Q5c', 'Q5d', 'Q5e', 'Q5f', 'Q5g', 'Q5h', 'Q5i', 'Q5j'];
  q5Items.forEach(qid => {
    // Asumsi jika Q5j belum ada di 'answers', kita perlu handle.
    // Untuk Q5j, jika tidak ada komentar atau nilai, skornya 0. Ini perlu diimplementasikan jika Anda menambahkan Q5j.
    // Untuk sekarang, kita anggap semua Q5b-i ada dan Q5j = 0 jika tidak ada.
    sumQ5b_j += (answers[qid] || 0); 
  });
  if (sumQ5b_j === 0) scoreDistb = 0;
  else if (sumQ5b_j >= 1 && sumQ5b_j <= 9) scoreDistb = 1;
  else if (sumQ5b_j > 9 && sumQ5b_j <= 18) scoreDistb = 2; // PDF: >9 dan <=18
  else if (sumQ5b_j > 18) scoreDistb = 3; // PDF: >18

  // 3. PSQILATEN (Latensi Tidur) - Berdasarkan Q2 (menit) dan Q5a 
  // Q2 (menit untuk tidur) -> perlu di-recode ke Q2new (0-3)
  // Q5a (kesulitan tidur <30mnt) -> skor 0-3
  // LATEN = skor Q2new + skor Q5a -> lalu di-recode lagi
  const q2Minutes = answers['Q2'] || 0; // Asumsi Q2 adalah jawaban mentah menit
  let q2NewScore = 0;
  if (q2Minutes >= 0 && q2Minutes <= 15) q2NewScore = 0;
  else if (q2Minutes > 15 && q2Minutes <= 30) q2NewScore = 1;
  else if (q2Minutes > 30 && q2Minutes <= 60) q2NewScore = 2;
  else if (q2Minutes > 60) q2NewScore = 3;
  
  const q5aScore = answers['Q5a'] || 0;
  const sumLaten = q2NewScore + q5aScore;

  if (sumLaten === 0) scoreLaten = 0;
  else if (sumLaten >= 1 && sumLaten <= 2) scoreLaten = 1; // PDF: >1 dan <=2 salah, seharusnya >=1 dan <=2
  else if (sumLaten >= 3 && sumLaten <= 4) scoreLaten = 2; // PDF: >3 dan <=4 salah, seharusnya >=3 dan <=4
  else if (sumLaten >= 5 && sumLaten <= 6) scoreLaten = 3; // PDF: >5 dan <=6 salah, seharusnya >=5 dan <=6
  
  // 4. PSQIDAYDYS (Disfungsi Siang Hari) - Berdasarkan Q8 dan Q9 
  const q8Score = answers['Q8'] || 0;
  const q9Score = answers['Q9'] || 0;
  const sumDaydys = q8Score + q9Score;
  if (sumDaydys === 0) scoreDaydys = 0;
  else if (sumDaydys >= 1 && sumDaydys <= 2) scoreDaydys = 1;
  else if (sumDaydys >= 3 && sumDaydys <= 4) scoreDaydys = 2;
  else if (sumDaydys >= 5 && sumDaydys <= 6) scoreDaydys = 3;

  // 5. PSQIHSE (Efisiensi Tidur) - Berdasarkan Q1, Q3, Q4 
  // Ini paling kompleks: Waktu di tempat tidur (newtib) = Q3 - Q1
  // Efisiensi = (Q4 / newtib) * 100
  // Untuk implementasi penuh, Anda perlu input Q1 (waktu tidur) dan Q3 (waktu bangun)
  // Untuk sekarang, kita bisa set default atau hitung berdasarkan asumsi jika data tidak lengkap
  // Misal kita butuh jawaban Q1 (bedTime) dan Q3 (getUpTime)
  // const bedTime = answers['Q1']; // misal '22:00'
  // const getUpTime = answers['Q3']; // misal '06:00'
  // Jika data ini tidak ada, HSE tidak bisa dihitung akurat. Untuk contoh, kita set 0.
  scoreHse = 0; // Placeholder, perlu implementasi penuh dengan Q1 dan Q3

  // 6. PSQISLPQUAL (Kualitas Tidur Subjektif) - Berdasarkan Q6 
  scoreSlpqual = answers['Q6'] || 0;

  // 7. PSQIMEDS (Penggunaan Obat Tidur) - Berdasarkan Q7 
  scoreMeds = answers['Q7'] || 0;


  // Total Skor PSQI 
  const totalScore = scoreDurat + scoreDistb + scoreLaten + scoreDaydys + scoreHse + scoreSlpqual + scoreMeds;

  let category = '';
  let advice = '';

  // Interpretasi Total Skor PSQI 
  if (totalScore <= 5) {
    category = 'Kualitas Tidur Baik';
    advice = 'Kualitas tidur Anda secara umum baik. Pertahankan kebiasaan tidur yang sehat!';
  } else { // totalScore > 5
    category = 'Kualitas Tidur Buruk';
    advice = 'Kualitas tidur Anda menunjukkan adanya masalah. Pertimbangkan untuk memperbaiki rutinitas tidur Anda. Jika masalah berlanjut, konsultasikan dengan dokter atau spesialis tidur.';
  }

  // Anda juga bisa mengembalikan skor per komponen jika ingin ditampilkan di detail
  return {
    totalScore,
    category,
    advice,
    // components: { scoreDurat, scoreDistb, scoreLaten, scoreDaydys, scoreHse, scoreSlpqual, scoreMeds }
  };
};


export default function PSQIScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 'answers' sekarang akan menyimpan objek dengan key berupa id pertanyaan
  const [answers, setAnswers] = useState({});
  const [currentNumberPickerValue, setCurrentNumberPickerValue] = useState(5); // Default untuk Q4, misalnya 5 jam

  const currentQuestion = psqiQuestions[currentQuestionIndex];

  // Set nilai awal untuk number picker saat pertanyaan berubah
  useEffect(() => {
    if (currentQuestion.type === 'number_picker') {
      setCurrentNumberPickerValue(answers[currentQuestion.id] ?? currentQuestion.options.min ?? 5);
    }
  }, [currentQuestionIndex, currentQuestion, answers]);


  const handleSelectOption = (questionId, optionValue) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: optionValue,
    }));
  };

  const handleNumberPickerChange = (newValue) => {
    let value = Math.max(currentQuestion.options.min, Math.min(currentQuestion.options.max, newValue));
    // Handle step jika ada (misal 0.5 untuk jam)
    if (currentQuestion.options.step === 0.5) {
        value = Math.round(value * 2) / 2;
    } else {
        value = Math.round(value);
    }
    setCurrentNumberPickerValue(value);
    handleSelectOption(currentQuestion.id, value); // Simpan langsung
  };


  const handleLanjutkan = () => {
    if (answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi atau masukkan nilai sebelum melanjutkan.");
      return;
    }

    if (currentQuestionIndex < psqiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Pertanyaan terakhir, hitung skor dan navigasi
      const { totalScore, category, advice } = calculatePSQIScoreAndCategory(answers);
      
      // Simpan ke database (jika perlu)
      // try {
      //   const db = await getDBConnection();
      //   await addAssessmentResult(db, 'PSQI', totalScore, category, advice, JSON.stringify(answers));
      //   console.log('PSQI result saved');
      // } catch (error) {
      //   console.error('Failed to save PSQI result', error);
      // }

      navigation.navigate('PSQIResult', { // Buat screen PSQIResult
        score: totalScore,
        category,
        advice,
        fullAnswers: answers, // Kirim semua jawaban mentah jika perlu
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

  const progress = ((currentQuestionIndex + 1) / psqiQuestions.length) * 100;

  // --- Render Fungsi untuk Berbagai Tipe Input ---
  const renderInputType = () => {
    if (currentQuestion.type === 'number_picker') {
      const { min, max } = currentQuestion.options;
      const displayValues = [];
      for (let i = Math.max(0, currentNumberPickerValue - 2); i <= Math.min(max, currentNumberPickerValue + 2); i += (currentQuestion.options.step || 1)) {
          // Pastikan tidak melebihi min dan max
          if (i >= min && i <= max) {
            displayValues.push(i);
          }
      }
      // Jika displayValues kurang dari 5, coba tambahkan dari sekitar picker value
      // Ini hanya untuk UI, logika utamanya ada di handleNumberPickerChange

      return (
        <View style={styles.numberPickerContainer}>
            <TouchableOpacity onPress={() => handleNumberPickerChange(currentNumberPickerValue - (currentQuestion.options.step || 1))} disabled={currentNumberPickerValue <= min}>
                <Icon name="chevron-up" size={50} color={currentNumberPickerValue <= min ? '#BDBDBD' : '#00695C'} />
            </TouchableOpacity>
            <Text style={styles.numberPickerValueAroundSmall}>{currentNumberPickerValue > min ? (currentNumberPickerValue - (currentQuestion.options.step || 1)).toFixed(currentQuestion.options.step === 0.5 ? 1 : 0) : ' '}</Text>
            <View style={styles.numberPickerHighlight}>
                <Text style={styles.numberPickerValueBesar}>
                    {currentNumberPickerValue.toFixed(currentQuestion.options.step === 0.5 ? 1 : 0)}
                </Text>
            </View>
            <Text style={styles.numberPickerValueAroundSmall}>{currentNumberPickerValue < max ? (currentNumberPickerValue + (currentQuestion.options.step || 1)).toFixed(currentQuestion.options.step === 0.5 ? 1 : 0) : ' '}</Text>
            <TouchableOpacity onPress={() => handleNumberPickerChange(currentNumberPickerValue + (currentQuestion.options.step || 1))} disabled={currentNumberPickerValue >= max}>
                <Icon name="chevron-down" size={50} color={currentNumberPickerValue >= max ? '#BDBDBD' : '#00695C'} />
            </TouchableOpacity>
        </View>
      );
    } 
    else if (currentQuestion.type === 'single_choice') {
      return (
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                answers[currentQuestion.id] === option.value && styles.optionItemSelected
              ]}
              onPress={() => handleSelectOption(currentQuestion.id, option.value)}
            >
              <Text 
                style={[
                  styles.optionText, 
                  answers[currentQuestion.id] === option.value && styles.optionTextSelected
                ]}
              >
                {option.text}
              </Text>
              <View 
                style={[
                  styles.checkboxBase, 
                  answers[currentQuestion.id] === option.value && styles.checkboxChecked
                ]}
              >
                {answers[currentQuestion.id] === option.value && (
                  <Icon name="check" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    // Tambahkan tipe input lain di sini (misal, time picker, text input)
    return <Text>Tipe pertanyaan tidak didukung: {currentQuestion.type}</Text>;
  };


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
      >
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        {currentQuestion.subtext && <Text style={styles.questionSubtext}>{currentQuestion.subtext}</Text>}

        {renderInputType()}
        
        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
            style={[styles.actionButton, (answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null) && styles.disabledButton]} 
            onPress={handleLanjutkan}
            disabled={(answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null)}
        >
          <Text style={styles.actionButtonText}>
            {currentQuestionIndex === psqiQuestions.length - 1 ? 'Lihat Hasil' : 'Lanjutkan'}
          </Text>
          <Icon name="arrow-right" size={20} color="white" style={{marginLeft: 8}}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles disesuaikan dengan UI baru
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Latar abu-abu muda
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F0F2F5',
  },
  backButton: {
    padding: 5,
  },
  progressBarOuter: {
    flex: 1,
    height: 8,
    backgroundColor: '#D1D9E6', // Track progress bar lebih soft
    borderRadius: 4,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#00695C', // Warna hijau Maseh
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 30, // Jarak dari header ke pertanyaan
    paddingBottom: 20,
  },
  questionText: {
    fontSize: 24, // Font lebih besar
    fontWeight: '600',
    color: '#263238',
    marginBottom: 10, // Jarak ke subtext atau opsi
    lineHeight: 32,
  },
  questionSubtext: {
    fontSize: 14,
    color: '#546E7A',
    marginBottom: 30, // Jarak ke opsi
    lineHeight: 20,
  },
  // Styles untuk Number Picker (Q4)
  numberPickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  numberPickerValueBesar: {
    fontSize: 72, // Ukuran angka utama besar
    fontWeight: 'bold',
    color: '#00695C', // Warna hijau Maseh
    marginVertical: 5, // Sedikit jarak
  },
  numberPickerHighlight: { // Kotak pembungkus angka besar
    backgroundColor: '#FFFFFF', // Latar putih
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15, // Sudut membulat
    borderWidth: 3,
    borderColor: '#B2DFDB', // Border hijau muda
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minWidth: 120, // Lebar minimal
    alignItems: 'center',
  },
  numberPickerValue周辺Kecil: { // Angka di atas dan bawah (lebih kecil)
    fontSize: 36,
    color: '#78909C', // Warna abu-abu
    opacity: 0.7,
  },
  // Styles untuk Opsi Pilihan Tunggal (Q5, Q6, dll.)
  optionsContainer: {
    marginTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20, // Padding lebih
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5, // Border sedikit lebih tebal
    borderColor: '#CFD8DC', // Warna border default
  },
  optionItemSelected: {
    backgroundColor: '#00695C', // Warna hijau Maseh saat dipilih
    borderColor: '#004D40', // Border lebih gelap saat dipilih
  },
  optionText: {
    fontSize: 16,
    color: '#37474F',
    flex: 1,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkboxBase: {
    width: 26, // Checkbox lebih besar sedikit
    height: 26,
    borderRadius: 6, // Sudut lebih membulat
    borderWidth: 2,
    borderColor: '#90A4AE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  checkboxChecked: {
    backgroundColor: '#black', // Latar putih agar ikon check terlihat
    borderColor: '#FFFFFF', // Border putih
  },
  spacer: {
    flex: 1,
  },
  bottomButtonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#F0F2F5', // Samakan dengan latar utama
    borderTopWidth: 1,
    borderTopColor: '#CFD8DC', // Garis pemisah lebih soft
  },
  actionButton: {
    backgroundColor: '#00695C',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 35,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#B2DFDB', // Warna hijau Maseh lebih muda saat disabled
  },
});