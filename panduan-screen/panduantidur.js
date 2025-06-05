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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ILUSTRASI_PANDUAN = require('../assets/images/man holding notes_1.png');
const BACKGROUND_BERPOLA = require('../assets/images/Panduan.png');

export default function PanduanScreen({ navigation, route }) {
  let judulPanduan = "Panduan Pengisian:";
  let teksDeskripsi = [
    "Kuesioner ini terdiri dari beberapa pertanyaan yang dirancang untuk membantu Anda memahami kondisi Anda saat ini. Bacalah setiap pertanyaan dengan saksama, lalu pilih jawaban yang paling sesuai dengan kondisi Anda dalam periode waktu yang ditentukan (misalnya, 2 minggu terakhir). Tidak ada jawaban benar atau salah—jawablah dengan jujur sesuai keadaan Anda."
  ];
  let navigateToScreen = 'PSQI';

  // ... (Logika untuk menyesuaikan konten berdasarkan route.params) ...

  return (
    <ImageBackground
        source={BACKGROUND_BERPOLA}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ width: 28 }} /> 
        </View>

        {/* ScrollView sekarang hanya untuk konten utama, bukan tombol */}
        <ScrollView 
            style={styles.scrollViewArea} // Style baru untuk area scroll
            contentContainerStyle={styles.scrollContentContainer}
        >
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
          {/* Tombol Container dipindahkan ke luar ScrollView */}
        </ScrollView>

        {/* Tombol Container sekarang di luar ScrollView, di dalam SafeAreaView */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(navigateToScreen)}
          >
            <Text style={styles.buttonText}>Mulai</Text>
          </TouchableOpacity>
        </View>

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
    // justifyContent: 'space-between', // Hapus ini jika sudah ada ScrollView flex:1 dan View tombol statis
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  // Area untuk ScrollView agar mengambil ruang yang tersedia sebelum tombol bawah
  scrollViewArea: {
      flex: 1, // Ini penting agar ScrollView mengambil sisa ruang vertikal
  },
  scrollContentContainer: {
    // flexGrow: 1, // Tidak selalu perlu jika scrollViewArea sudah flex:1
    paddingHorizontal: 25,
    paddingBottom: 20, // Padding bawah untuk konten di dalam scroll, agar tidak tertutup total oleh tombol jika scroll penuh
    // justifyContent: 'space-between', // Hapus ini karena tombol sudah statis di bawah
  },
  headerTextContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 10,
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
    marginBottom: 20, // Kurangi margin bawah karena tombol sudah di luar scroll
  },
  descriptionText: {
    fontSize: 16,
    color: '#E8F5E9',
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: 15,
  },
  // Style untuk container tombol yang sekarang statis di bawah
  bottomButtonContainer: {
    paddingHorizontal: 25, // Samakan dengan padding scrollContainer
    paddingVertical: 15,   // Padding atas dan bawah untuk tombol
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, // Padding bawah ekstra untuk home indicator/navigasi sistem
    backgroundColor: 'transparent', // Atau samakan dengan warna latar jika perlu
    // borderTopWidth: 1, // Opsional: garis pemisah jika diinginkan
    // borderTopColor: 'rgba(255,255,255,0.2)',
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
    marginBottom:35,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
