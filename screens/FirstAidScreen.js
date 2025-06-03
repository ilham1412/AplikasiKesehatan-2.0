// screens/BantuanPertolonganPertamaScreen.js (atau FirstAidScreen.js)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // Image, // Image tidak digunakan di header ini, kecuali Anda ingin menambahkan logo kecil
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Menggunakan MaterialCommunityIcons untuk panah

// Aktifkan LayoutAnimation untuk Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Komponen AccordionItem dimodifikasi untuk style baru
const AccordionItem = ({ title, children, isOpen, onPress, itemType = 'normal' }) => {
  // Tentukan style berdasarkan itemType
  const headerStyle = [
    styles.accordionHeader,
    itemType === 'emergency' ? styles.emergencyHeader : styles.normalHeader
  ];
  const titleStyle = [
    styles.accordionTitle,
    itemType === 'emergency' ? styles.emergencyTitleText : styles.normalTitleText
  ];
  const iconColor = itemType === 'emergency' ? "#FFFFFF" : "#FFFFFF"; // Ikon panah selalu putih
  const contentStyle = [
    styles.accordionContent,
    itemType === 'emergency' ? styles.emergencyContent : styles.normalContent
  ];

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={headerStyle} onPress={onPress} activeOpacity={0.8}>
        <Text style={titleStyle}>{title}</Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={28} color={iconColor} />
      </TouchableOpacity>
      {isOpen && (
        <View style={contentStyle}>
          {children}
        </View>
      )}
    </View>
  );
};

const EmergencyContact = ({ label, number }) => (
  <View style={styles.emergencyContactRow}>
    <Text style={styles.emergencyLabel}>{label}: </Text>
    <Text style={styles.emergencyNumber}>{number}</Text>
  </View>
);

export default function BantuanPertolonganPertamaScreen({ navigation }) {
  // Item "Bantuan Pertolongan Pertama" (indeks 0) terbuka secara default
  const [activeIndex, setActiveIndex] = useState(0);

  const emergencyContactsData = [
    { label: 'Nomor telepon polisi', number: '110' },
    { label: 'Nomor telepon ambulans', number: '118 dan 119' },
    { label: 'Nomor telepon Badan Search and Rescue Nasional (Basarnas)', number: '115' },
    { label: 'Nomor telepon darurat masalah kekerasan terhadap perempuan dan anak SAPA 129', number: '129' },
    // Tambahkan PLN dan Pemadam Kebakaran jika masih relevan dengan "Bantuan Pertolongan Pertama"
    // { label: 'PLN', number: '123' },
    // { label: 'Pemadam Kebakaran', number: '113 & 1131' },
  ];

  const pertolonganData = [
    {
      title: 'Bantuan Pertolongan Pertama', // Judul sesuai gambar
      itemType: 'emergency', // Tipe khusus untuk styling berbeda
      isEmergencyContacts: true,
      content: emergencyContactsData,
    },
    {
      title: 'Luka dan Pendarahan', // Sesuai gambar
      itemType: 'normal',
      content: "Luka, luka, luka yang 'ku rasakan\nBertubi-tubi-tubi engkau berikan\nCintaku bertepuk sebelah tangan\nTapi aku balas senyum keindahan\n\nBertahan satu cinta\nBertahan satu C.I.N.T.A\nBertahan satu cinta\nBertahan satu C.I.N.T.A", // Konten dari gambar
    },
    {
      title: 'Luka Bakar',
      itemType: 'normal',
      content: 'Penanganan untuk berbagai jenis luka bakar, dari ringan hingga berat. Pastikan untuk mendinginkan area yang terbakar dengan air mengalir selama beberapa menit...',
    },
    {
      title: 'Patah Tulang',
      itemType: 'normal',
      content: 'Kenali gejala patah tulang dan jangan mencoba menggerakkan bagian yang cedera. Segera cari bantuan medis profesional...',
    },
    {
      title: 'Patah Hati', // Sesuai gambar (humor?)
      itemType: 'normal',
      content: 'Meskipun bukan cedera fisik, patah hati juga membutuhkan "pertolongan pertama" emosional. Berikan diri Anda waktu, bicara dengan orang terpercaya, dan lakukan hal yang Anda nikmati.',
    },
    // Tambahkan item lain seperti "Pedoman CPR", "Serangan Jantung", "Mimisan" jika perlu
  ];

  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      <View style={styles.mainHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.mainBackButton}>
          <Icon name="arrow-left" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.mainHeaderTitle}>Panduan Pertolongan Pertama</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {pertolonganData.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            isOpen={activeIndex === index}
            onPress={() => toggleAccordion(index)}
            itemType={item.itemType} // Kirim tipe item untuk styling
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
      </ScrollView>
      {/* Tidak ada footer navigasi di layar ini sesuai desain */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Latar belakang utama (abu-abu muda)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F4F6F8', // Samakan dengan safeArea atau buat berbeda
    // borderBottomWidth: 1, // Opsional: garis bawah header
    // borderBottomColor: '#DCDCDC',
  },
  mainBackButton: {
    padding: 8, // Area sentuh
    marginRight: 10,
  },
  mainHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004D40', // Warna hijau tua Maseh
  },
  scrollContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20, // Jarak di akhir scroll
  },
  accordionContainer: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden', // Penting untuk borderRadius pada View
    elevation: 2, // Shadow tipis
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  emergencyHeader: {
    backgroundColor: '#D32F2F', // Merah untuk header darurat
  },
  normalHeader: {
    backgroundColor: '#00695C', // Hijau tua untuk header normal
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1, 
  },
  emergencyTitleText: {
    color: '#FFFFFF', // Teks putih
  },
  normalTitleText: {
    color: '#FFFFFF', // Teks putih
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingVertical: 15, // Padding atas dan bawah untuk konten
  },
  emergencyContent: {
    backgroundColor: '#FFEBEE', // Pink muda untuk konten darurat
  },
  normalContent: {
    backgroundColor: '#E0F2F1', // Hijau muda untuk konten normal
  },
  accordionContentText: {
    fontSize: 15,
    color: '#333333', // Warna teks konten
    lineHeight: 22,
  },
  emergencyContactRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start', // Untuk teks yang mungkin wrap
  },
  emergencyLabel: {
    fontSize: 15,
    color: '#D32F2F', // Warna teks label (merah)
    marginRight: 5,
  },
  emergencyNumber: {
    fontSize: 15,
    color: '#D32F2F',
    fontWeight: 'bold',
    flexShrink: 1, // Agar nomor bisa wrap jika panjang
  },
});
