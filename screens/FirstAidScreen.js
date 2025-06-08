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
    { label: 'Nomor telepon darurat masalah kekerasan terhadap perempuan dan anak SAPA', number: '129' },
    { label: 'PLN', number: '123' },
    { label: 'Pemadam Kebakaran', number: '113 & 1131' },
  ];

  const pertolonganData = [
    {
      title: 'Bantuan Pertolongan Pertama', // Judul sesuai gambar
      itemType: 'emergency', // Tipe khusus untuk styling berbeda
      isEmergencyContacts: true,
      content: emergencyContactsData,
    },
    {
  title: 'Luka dan Pendarahan',
  itemType: 'normal',
  content: `Pertolongan pertama pada luka dan pendarahan dimulai dengan mencuci tangan menggunakan sabun atau hand sanitizer untuk mencegah infeksi. Selanjutnya, hentikan pendarahan dengan menekan luka menggunakan kain bersih selama 5–10 menit. Jika perban basah, jangan dilepas, cukup tambahkan lapisan baru di atasnya. Setelah pendarahan berhenti, bersihkan luka dengan air mengalir dan hindari penggunaan alkohol atau hidrogen peroksida secara langsung. Tutup luka menggunakan kasa steril atau perban dan ganti secara rutin, terutama jika kotor atau basah. Jika memungkinkan, angkat bagian tubuh yang terluka lebih tinggi dari jantung untuk mengurangi aliran darah. Segera cari bantuan medis jika pendarahan tidak berhenti dalam 10 menit, luka sangat dalam atau panjang, atau disebabkan oleh gigitan hewan maupun benda berkarat.`,
    },

    {
      title: 'Luka Bakar',
      itemType: 'normal',
      content: 'Pertolongan pertama pada luka bakar dimulai dengan menghentikan sumber panas dan segera mendinginkan area yang terbakar menggunakan air mengalir selama 10–20 menit, jangan gunakan es atau air sangat dingin karena bisa merusak jaringan kulit. Hindari menyentuh atau memecahkan lepuh yang muncul. Setelah itu, tutupi luka dengan kain bersih atau perban non-lengket secara longgar untuk mencegah infeksi. Jangan mengoleskan pasta gigi, mentega, atau bahan rumah tangga lainnya pada luka bakar. Segera cari bantuan medis jika luka bakar luas, dalam, mengenai wajah, tangan, alat kelamin, atau disebabkan oleh bahan kimia atau listrik.',
    },
    {
      title: 'Patah Tulang',
      itemType: 'normal',
      content: 'Pertolongan pertama pada patah tulang dimulai dengan menjaga agar area yang diduga patah tidak digerakkan untuk mencegah cedera lebih lanjut. Jangan mencoba meluruskan atau memaksakan posisi tulang kembali. Gunakan penyangga atau bidai jika memungkinkan, dengan membalut area tersebut menggunakan kain atau perban agar tetap stabil. Kompres dingin (es yang dibungkus kain) dapat diletakkan di atas area yang cedera untuk mengurangi pembengkakan, namun jangan langsung menyentuh kulit. Segera bawa korban ke fasilitas kesehatan untuk pemeriksaan dan penanganan lebih lanjut. Jika korban tidak sadar, mengalami nyeri hebat, atau terlihat ada pendarahan hebat, segera hubungi layanan darurat.',
    },
    {
      title: 'Patah Hati', 
      itemType: 'normal',
      content: 'Pertolongan pertama pada patah hati dimulai dengan menerima dan mengakui perasaan sedih yang muncul—menangis itu tidak apa-apa. Beri waktu untuk diri sendiri sembuh, jangan memaksakan untuk "baik-baik saja" seketika. Hindari menyendiri terlalu lama; ceritakan perasaanmu pada teman dekat atau orang yang kamu percaya. Alihkan perhatian dengan melakukan hal-hal yang kamu sukai atau coba hal baru yang positif. Jaga pola makan, tidur, dan aktivitas fisik agar tubuh tetap sehat saat hati sedang rapuh. Jika perasaan sedih berlarut-larut atau mulai mengganggu aktivitas sehari-hari, jangan ragu untuk mencari bantuan dari konselor atau profesional kesehatan mental. Ingat, patah hati adalah bagian dari hidup, tapi kamu tidak harus menghadapinya sendirian.',
    },
    {
      title: 'depresi', 
      itemType: 'normal',
      content: 'Pertolongan pertama pada depresi dimulai dengan mengenali tanda-tandanya, seperti perasaan sedih berkepanjangan, kehilangan minat, kelelahan, perubahan pola tidur atau makan, hingga merasa tidak berharga. Jika kamu atau orang terdekat mengalami gejala ini, penting untuk tidak mengabaikannya. Ajak berbicara secara terbuka dan tanpa menghakimi, tunjukkan bahwa kamu peduli dan siap mendengarkan. Hindari memberi nasihat yang menyederhanakan kondisi, seperti “ayo semangat” atau “jangan dipikirkan.” Dorong untuk mencari bantuan profesional seperti psikolog atau psikiater, dan dampingi bila perlu. Jaga rutinitas harian, tetap aktif, dan cari dukungan dari lingkungan positif. Depresi bisa diatasi, dan bantuan tersedia—langkah kecil ke arah yang tepat sangat berarti.'
    },
     {
      title: 'Kecelakaan', 
      itemType: 'normal',
      content: 'Pertolongan pertama pada orang yang baru mengalami kecelakaan dimulai dengan memastikan keamanan lokasi, baik bagi korban maupun penolong. Jangan memindahkan korban kecuali berada dalam bahaya langsung (seperti risiko kebakaran atau ledakan). Periksa respons korban dengan memanggil atau menyentuh perlahan. Jika korban tidak sadar dan tidak bernapas, segera lakukan CPR jika terlatih, dan hubungi layanan darurat secepat mungkin. Jika korban sadar, tenangkan dengan suara lembut dan yakinkan bahwa bantuan sedang dalam perjalanan. Hentikan pendarahan besar dengan menekan luka menggunakan kain bersih, dan jangan memberikan makanan atau minuman karena bisa mengganggu penanganan medis. Jaga agar korban tetap hangat dan stabil sampai bantuan datang', 
    }
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
    justifyContent: 'space-between', // Ini akan membantu mendorong nomor ke kanan
    alignItems: 'flex-start',       // Jaga agar teks tetap rata atas saat wrap
    marginBottom: 8,
  }, 
   emergencyLabel: {
    fontSize: 15,
    color: '#D32F2F',
    marginRight: 8, // Beri sedikit lebih banyak spasi
    flex: 1,     
  },
  emergencyNumber: {
    fontSize: 15,
    color: '#D32F2F',
    fontWeight: 'bold',
    //flexShrink: 1, // Agar nomor bisa wrap jika panjang
  },
});
