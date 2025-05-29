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
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Menggunakan MaterialIcons

// Aktifkan LayoutAnimation untuk Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AccordionItem = ({ title, children, isOpen, onPress, isFirstItem = false }) => {
  return (
    <View style={[styles.accordionContainer, isFirstItem && styles.firstAccordionContainer]}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Icon name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={28} color={isFirstItem ? "#FFF" : "#4DB6AC"} />
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.accordionContent, isFirstItem && styles.firstAccordionContent]}>
          {children}
        </View>
      )}
    </View>
  );
};

const EmergencyContact = ({ label, number }) => (
  <View style={styles.emergencyContactRow}>
    <Text style={styles.emergencyLabel}>{label}:</Text>
    <Text style={styles.emergencyNumber}>{number}</Text>
  </View>
);

export default function BantuanPertolonganPertamaScreen({ navigation }) {
  // Item "Telepon Darurat" terbuka secara default (index 0)
  const [activeIndex, setActiveIndex] = useState(0);

  const emergencyContactsData = [
    { label: 'Polisi', number: '110' },
    { label: 'Ambulans', number: '118 & 119' },
    { label: 'Basarnas', number: '115' },
    { label: 'Posko Bencana Alam', number: '129' }, // Sesuai gambar
    { label: 'PLN', number: '123' },             // Sesuai gambar
    { label: 'Pemadam Kebakaran', number: '113 & 1131' }, // Sesuai gambar
  ];

  const pertolonganData = [
    {
      title: 'Telepon Darurat',
      isEmergencyContacts: true, // Flag khusus untuk item ini
      content: emergencyContactsData, // Menggunakan data kontak darurat
    },
    {
      title: 'Pedoman CPR',
      content: 'Deskripsi dan langkah-langkah untuk melakukan CPR (Cardiopulmonary Resuscitation)...',
    },
    {
      title: 'Serangan Jantung',
      content: 'Kenali gejala serangan jantung dan tindakan pertama yang harus dilakukan...',
    },
    {
      title: 'Jatuh dan Memar',
      content: 'Cara menangani memar dan cedera akibat jatuh...',
    },
    {
      title: 'Kulit Terbakar',
      content: 'Penanganan untuk berbagai jenis luka bakar, dari ringan hingga berat...',
    },
    {
      title: 'Mimisan',
      content: 'Langkah-langkah efektif untuk menghentikan mimisan...',
    },
    // Tambahkan item lain jika perlu
  ];

  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.overallContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerContainer}>
          <Image
            // GANTI DENGAN PATH LOGO ANDA YANG SESUAI DENGAN GAMBAR REVISI
            // Placeholder jika logo dari gambar revisi belum ada:
            source={require('../assets/images/MASEH IJO.png')} // Ganti dengan path logo Anda
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {pertolonganData.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            isOpen={activeIndex === index}
            onPress={() => toggleAccordion(index)}
            isFirstItem={index === 0} // Tandai jika ini item pertama
          >
            {item.isEmergencyContacts ? (
              item.content.map((contact, cIndex) => (
                <EmergencyContact key={cIndex} label={contact.label} number={contact.number} />
              ))
            ) : (
              <Text style={styles.accordionContentText}>{item.content}</Text>
            )}
          </AccordionItem>
        ))}
        {/* Tombol Kembali dihapus sesuai desain baru */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Latar belakang putih keseluruhan
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 20,
    paddingBottom: 15,
    // backgroundColor: '#F8F8F8', // Jika header punya background berbeda
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333', // Warna teks header
  },
  accordionContainer: {
    backgroundColor: '#FFFFFF', // Latar belakang item accordion
    borderRadius: 12, // Radius sudut item
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Border tipis untuk semua item
  },
  firstAccordionContainer: { // Style khusus untuk item "Telepon Darurat"
    backgroundColor: '#4DB6AC', // Warna header teal
    borderColor: '#4DB6AC',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333', // Warna judul default
    flex: 1, // Agar judul mengambil ruang yang tersedia
  },
  firstAccordionContainer_accordionTitle: { // Seharusnya ini diterapkan pada Text di dalam firstAccordionContainer
     color: '#FFFFFF', // Warna judul putih untuk item pertama
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF', // Latar belakang konten default
  },
  firstAccordionContent: { // Style khusus untuk konten "Telepon Darurat"
    backgroundColor: '#E0F2F1', // Warna latar belakang konten teal muda
    paddingTop: 15,
    paddingBottom:15,
  },
  accordionContentText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 21,
  },
  emergencyContactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emergencyLabel: {
    fontSize: 14,
    color: '#424242',
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#424242',
    fontWeight: 'bold',
  },
    logoIcon: {
    marginRight: 10,
  },

  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00695C', // Warna teks MASEH
  },

  logoImage: {
  width: 250,       // sesuaikan ukuran
  height: 100,
  alignSelf: 'center',
  marginBottom: 30,
},
});
