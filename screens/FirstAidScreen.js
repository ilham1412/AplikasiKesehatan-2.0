// screens/BantuanPertolonganPertamaScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  LayoutAnimation, // Untuk animasi dropdown
  Platform,        // Untuk UIManager di Android
  UIManager,       // Untuk UIManager di Android
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Menggunakan MaterialIcons untuk panah dropdown

// Aktifkan LayoutAnimation untuk Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AccordionItem = ({ title, children, isOpen, onPress }) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.accordionTitleContainer}>
          <View style={styles.circleIcon} />
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Icon name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={28} color="#333" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function BantuanPertolonganPertamaScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(null); // Menyimpan index item yang aktif/terbuka

  const pertolonganData = [
    {
      title: 'Luka dan Pendarahan',
      content:
        'Ini adalah deskripsi untuk penanganan luka dan pendarahan. Pastikan area luka bersih dan berikan tekanan jika terjadi pendarahan hebat. Segera cari bantuan medis jika diperlukan.',
    },
    {
      title: 'Luka Bakar',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo facilisis interdum. Quisque ullamcorper ex in ante molestie, at maximus neque volutpat. Nam gravida mi eu augue ornare malesuada scelerisque sit amet diam. Phasellus in purus rutrum eros bibendum dignissim.',
    },
    {
      title: 'Patah Tulang',
      content:
        'Penanganan patah tulang meliputi imobilisasi area yang cedera. Jangan mencoba meluruskan tulang yang patah. Segera hubungi layanan medis darurat.',
    },
    // Tambahkan item lain jika perlu
  ];

  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animasi
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.overallContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerLogoContainer}>
          <Image
            source={require('../assets/images/MASEH IJO.png')} // GANTI DENGAN PATH LOGO ANDA
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleBanner}>
          <Text style={styles.titleBannerText}>Bantuan Pertolongan Pertama</Text>
        </View>

        <View style={styles.emergencyNumbersContainer}>
          <Text style={styles.emergencyTitle}>Nomor telepon darurat:</Text>
          <Text style={styles.emergencyText}>Nomor telepon polisi: <Text style={styles.boldText}>110</Text></Text>
          <Text style={styles.emergencyText}>Nomor telepon ambulans: <Text style={styles.boldText}>118</Text> dan <Text style={styles.boldText}>119</Text></Text>
          <Text style={styles.emergencyText}>Nomor telepon Badan Search and Rescue Nasional (Basarnas): <Text style={styles.boldText}>115</Text></Text>
          <Text style={styles.emergencyText}>
            Nomor telepon darurat masalah kekerasan terhadap perempuan dan anak SAPA <Text style={styles.boldText}>129</Text> : <Text style={styles.boldText}>129</Text>
          </Text>
        </View>

        {pertolonganData.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            isOpen={activeIndex === index}
            onPress={() => toggleAccordion(index)}
          >
            <Text style={styles.accordionContentText}>{item.content}</Text>
          </AccordionItem>
        ))}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Warna latar belakang abu-abu muda (sesuaikan)
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 30, // Padding bawah agar tombol kembali tidak terlalu mepet
  },
  headerLogoContainer: {
    alignItems: 'center',
    paddingTop: 20, // Beri jarak dari atas
    // marginBottom: 10, // Dihapus, jarak diatur oleh elemen lain
  },
  logoImage: {
    width: 160, // Sesuaikan ukuran logo
    height: 55,  // Sesuaikan ukuran logo
  },
  titleBanner: {
    backgroundColor: '#80CBC4', // Warna banner hijau kebiruan
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Teks rata kiri
    justifyContent: 'center',
    marginTop: 15, // Jarak dari logo
    marginBottom: 20,
    width: '100%', // Lebar penuh
  },
  titleBannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Warna teks putih
  },
  emergencyNumbersContainer: {
    paddingHorizontal: 25, // Padding kiri kanan untuk blok nomor darurat
    marginBottom: 20,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 4,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  accordionContainer: {
    backgroundColor: '#FFFFFF', // Latar belakang item accordion putih
    borderRadius: 20,
    marginHorizontal: 20, // Jarak kiri kanan item
    marginBottom: 15,     // Jarak antar item
    overflow: 'hidden',   // Untuk memastikan border-radius bekerja dengan baik
    borderWidth: 1,
    borderColor: '#E0E0E0', // Border tipis
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B2DFDB', // Warna lingkaran (biru muda/tosca muda)
    marginRight: 15,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600', // Sedikit lebih tebal
    color: '#333333',
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingTop: 0, // Hapus padding atas karena sudah ada jarak dari header
    paddingBottom: 18,
  },
  accordionContentText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 21,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#80CBC4',
    alignSelf: 'center', // Pusatkan tombol
    marginTop: 20, // Jarak dari item accordion terakhir
  },
  backButtonText: {
    color: '#80CBC4',
    fontSize: 18,
    fontWeight: 'bold',
  },
});