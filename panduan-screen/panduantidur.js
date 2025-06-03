// screens/PanduanScreen.js (atau nama file Anda, misal Panduanstres.js)
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Untuk ikon kembali

// Ganti dengan path gambar ilustrasi utama Anda
const ILUSTRASI_PANDUAN = require('../assets/images/man holding notes_1.png');
// Ganti dengan path gambar LATAR BELAKANG BERPOLA Anda
const BACKGROUND_BERPOLA = require('../assets/images/Panduan.png');

export default function PanduanScreen({ navigation, route }) {
  let judulPanduan = "Panduan Pengisian:";
  let teksDeskripsi = [
    "Kuesioner ini terdiri dari beberapa pertanyaan yang dirancang untuk membantu Anda memahami kondisi Anda saat ini. Bacalah setiap pertanyaan dengan saksama, lalu pilih jawaban yang paling sesuai dengan kondisi Anda dalam periode waktu yang ditentukan (misalnya, 2 minggu terakhir). Tidak ada jawaban benar atau salah—jawablah dengan jujur sesuai keadaan Anda."
  ];
  let navigateToScreen = 'PSQI'; // Default navigasi ke PHQ9

  // Logika untuk menyesuaikan konten berdasarkan route.params bisa tetap di sini jika perlu
  // Contoh:
  // const { jenisTes } = route.params || {};
  // if (jenisTes === 'PSQI') {
  //   judulPanduan = "Panduan Pengisian Kualitas Tidur:";
  //   // ... teksDeskripsi dan navigateToScreen disesuaikan ...
  //   navigateToScreen = 'PSQI';
  // } else if (jenisTes === 'Lifestyle') {
  //   // ...
  //   navigateToScreen = 'Lifestyle';
  // }


  return (
    <ImageBackground
        source={BACKGROUND_BERPOLA}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        {/* Header Kustom dengan Tombol Kembali */}
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ width: 28 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{judulPanduan}</Text>
          </View>

          <View style={styles.illustrationContainer}>
            <Image
              source={ILUSTRASI_PANDUAN}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.descriptionContainer}>
            {teksDeskripsi.map((paragraf, index) => (
              <Text key={index} style={styles.descriptionText}>
                {paragraf}
              </Text>
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(navigateToScreen)}
            >
              <Text style={styles.buttonText}>Mulai</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  customHeader: { // Style untuk header kustom
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Untuk menyeimbangkan tombol kembali jika ada judul/placeholder
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 15, // Padding atas untuk header
    paddingBottom: 10, // Padding bawah untuk header
    // backgroundColor: 'rgba(0,0,0,0.1)', // Opsional: latar belakang tipis untuk header
  },
  backButton: {
    padding: 5, // Area sentuh
  },
  // customHeaderTitle: { // Aktifkan jika ingin ada judul di header kustom
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#FFFFFF',
  // },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 20, // Padding bawah untuk konten scroll
    // paddingTop sudah dihandle oleh header kustom atau jarak dari headerTextContainer
  },
  headerTextContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 10, // Mengurangi marginTop karena sudah ada header kustom
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 10,
  },
  illustrationImage: {
    width: 220,
    height: 220,
  },
  descriptionContainer: {
    marginBottom: 40,
  },
  descriptionText: {
    fontSize: 16,
    color: '#E8F5E9',
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: 15,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 77, 64, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
