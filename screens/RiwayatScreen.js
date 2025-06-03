// src/screens/RiwayatScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, Text, SectionList, TouchableOpacity, 
    StyleSheet, ActivityIndicator, Image, SafeAreaView, Platform, StatusBar 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAssessmentResults } from '../database/database'; // Sesuaikan path
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Fungsi untuk memformat timestamp menjadi objek yang bisa diolah
const parseTimestamp = (isoString) => {
  if (!isoString) return null;
  let correctedIsoString = isoString;
  if (typeof isoString === 'string' && isoString.includes(' ') && !isoString.includes('T') && !isoString.endsWith('Z') && !isoString.match(/[+-]\d{2}:\d{2}/)) {
    correctedIsoString = isoString.replace(' ', 'T') + 'Z';
  }
  const date = new Date(correctedIsoString);
  return isNaN(date.getTime()) ? null : date;
};

// Fungsi untuk mendapatkan label grup tanggal (Today, Yesterday, dll.)
const getDateGroupLabel = (date) => {
  if (!date) return 'Tanggal Tidak Valid';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('id-ID', { weekday: 'long', /*day: '2-digit', month: 'short'*/ }); // Wednesday, Thursday, etc.
};

// Fungsi untuk memformat waktu (misal: 11:00 PM)
const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/^0/, ''); // Hapus 0 di depan jika ada
};


// Mapping untuk ikon dan judul berdasarkan tipe asesmen (tetap sama atau sesuaikan ikon)
const assessmentInfo = {
  PHQ9: {
    title: 'Tingkat Depresi', // Di gambar "Tingkat Stres" diubah jadi "Tingkat Depresi"
    icon: require('../assets/images/icon depresi.png'), // GANTI DENGAN IKON BARU
    getIndicator: (category) => {
      switch (category.toLowerCase()) {
        case 'parah': return { text: 'Parah', color: '#E53935' };
        case 'berat': return { text: 'Berat', color: '#E53935' };
        case 'cukup parah': return { text: 'Cukup parah', color: '#EF5350'}; // Contoh
        case 'sedang-berat': return { text: 'Sedang-Berat', color: '#EF5350'}; // Contoh
        case 'sedang': return { text: 'Sedang', color: '#FFB300' };
        case 'ringan': return { text: 'Ringan', color: '#7CB342' };
        case 'minimal': return { text: 'Minimal', color: '#4CAF50' };
        case 'minimal atau tidak ada gejala': return { text: 'Minimal', color: '#4CAF50' };
        case 'tidak ada': return { text: 'Tidak ada', color: '#BDBDBD' };
        default: return { text: category, color: '#757575' };
      }
    }
  },
  SleepQuality: {
    title: 'Kualitas Tidur',
    icon: require('../assets/images/icon tidur.png'), // GANTI DENGAN IKON BARU
     getIndicator: (category) => {
      switch (category.toLowerCase()) {
        case 'sangat buruk': return { text: 'Sangat Buruk', color: '#D32F2F'};
        case 'buruk': return { text: 'Buruk', color: '#E53935'};
        case 'sedang': return { text: 'Sedang', color: '#FFB300'};
        case 'baik': return { text: 'Baik', color: '#4CAF50'};
        case 'sangat baik': return { text: 'Sangat Baik', color: '#2E7D32'};
        default: return { text: category, color: '#757575' };
      }
    }
  },
  Lifestyle: {
    title: 'Gaya Hidup',
    icon: require('../assets/images/icon gaya hidup.png'), // GANTI DENGAN IKON BARU
    getIndicator: (category) => {
      switch (category.toLowerCase()) {
        case 'buruk': return { text: 'Buruk', color: '#E53935' };
        case 'kurang': return { text: 'Kurang', color: '#FFB300' };
        case 'cukup': return { text: 'Cukup', color: '#FFEE58'};
        case 'baik': return { text: 'Baik', color: '#7CB342' };
        case 'sangat baik': return { text: 'Sangat Baik', color: '#4CAF50'};
        default: return { text: category, color: '#757575' };
      }
    }
  }
};

const RiwayatItem = ({ item, onPress }) => {
  const info = assessmentInfo[item.assessment_type] || { 
    title: item.assessment_type, 
    icon: require('../assets/images/MASEH PUTIH.png'), // Ikon default
    getIndicator: () => ({ text: item.category, color: '#757575' }) 
  };
  const categoryForIndicator = item.category || "";
  const indicator = info.getIndicator(categoryForIndicator);
  const itemDateObject = parseTimestamp(item.timestamp);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Image source={info.icon} style={styles.itemIconImage} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{info.title}</Text>
        <Text style={[styles.itemCategory, { color: indicator.color }]}>{indicator.text}</Text>
      </View>
      <Text style={styles.itemTime}>{itemDateObject ? formatTime(itemDateObject) : ''}</Text>
    </TouchableOpacity>
  );
};

// Fungsi untuk mengelompokkan data riwayat berdasarkan tanggal
const groupHistoryByDate = (historyData) => {
  if (!historyData || historyData.length === 0) return [];

  const grouped = historyData.reduce((acc, item) => {
    const dateObject = parseTimestamp(item.timestamp);
    if (!dateObject) return acc; // Lewati item dengan timestamp tidak valid

    const groupLabel = getDateGroupLabel(dateObject);
    
    const group = acc.find(g => g.title === groupLabel);
    if (group) {
      group.data.push(item);
    } else {
      acc.push({ title: groupLabel, data: [item] });
    }
    return acc;
  }, []);

  // Urutkan grup (Today, Yesterday, lalu tanggal lain dari terbaru ke terlama)
  // Ini bisa lebih kompleks, untuk sekarang kita biarkan urutan dari database (DESC)
  return grouped;
};


export default function RiwayatScreen({ navigation }) {
  const [groupedHistory, setGroupedHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await getAllAssessmentResults();
      const groupedData = groupHistoryByDate(results);
      setGroupedHistory(groupedData);
    } catch (error) {
      console.error("Failed to load history:", error);
      setGroupedHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerOnlyTitle}>
          <Text style={styles.headerTitleMain}>Riwayat</Text>
        </View>
        <View style={styles.centered}><ActivityIndicator size="large" color="#00796B" /></View>
      </SafeAreaView>
    );
  }
const ILUSTRASI_PANDUAN = require('../assets/images/man confused_1.png'); // Buat gambar ini
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerOnlyTitle}>
        <Text style={styles.headerTitleMain}>Riwayat</Text>
      </View>

      {groupedHistory.length === 0 && !isLoading ? (
        <View style={styles.centeredFlex}>
          <Image
            source={ILUSTRASI_PANDUAN} // Ganti dengan gambar ilustrasi Anda
            style={styles.illustrationImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText2}>Ups, Masih Kosong!</Text>
            <Text style={styles.emptyText}>Belum ada riwayat yang tercatat.</Text>
            <Text style={styles.emptyText}>coba isi kuis stress, tidur, atau gaya hidup hari ini, ya!.</Text>
        </View>
      ) : (
        <SectionList
          sections={groupedHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RiwayatItem
              item={item}
              onPress={() => navigation.navigate('RiwayatDetail', { assessmentId: item.id })}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContentContainer}
          stickySectionHeadersEnabled={false} 
        />
      )}
      
      {/* Footer Navigasi Statis */}
      <View style={styles.footerNav}>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="view-dashboard-outline" size={28} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => console.log("Navigasi ke Riwayat (sudah di sini)")}>
          <Icon name="history" size={28} color="#00695C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog-outline" size={28} color="#757575" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerOnlyTitle: { // Style untuk header yang hanya berisi judul "Riwayat"
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Judul rata kiri seperti di gambar
    backgroundColor: '#F4F6F8', // Atau samakan dengan screenContainer
    // borderBottomWidth: 1, // Opsional jika ingin garis bawah
    // borderBottomColor: '#E0E0E0',
  },
  headerTitleMain: {
    fontSize: 24, // Ukuran font lebih besar
    fontWeight: 'bold',
    color: '#00695C', // Warna hijau Maseh
  },
  listContentContainer: {
    paddingHorizontal: 15, // Padding untuk SectionList
    paddingBottom: 10, // Padding di bawah item terakhir
  },
  sectionHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5, // Sedikit padding untuk teks grup
    marginTop: 10, // Jarak antar grup
    marginBottom: 5,
    alignItems: 'center', // Pusatkan teks grup "Today", "Yesterday"
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
    backgroundColor: '#E0E0E0', // Latar belakang abu-abu untuk label grup
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden', // Agar borderRadius bekerja
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10, // Jarak antar item
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemIconImage: {
    width: 36, // Ukuran ikon disesuaikan
    height: 36,
    marginRight: 15,
    // backgroundColor: '#f0f0f0', // Placeholder jika ikon tidak ada
    // borderRadius: 18,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemCategory: { // Teks kategori (Parah, Buruk, dll.)
    fontSize: 13,
    fontWeight: 'bold', // Dibuat bold seperti di gambar
  },
  itemTime: { // Hanya menampilkan waktu
    fontSize: 13,
    color: '#757575',
  },
  centered: { // Untuk loading
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredFlex: { // Untuk teks "Belum ada riwayat" agar mengambil sisa ruang
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  emptyText2: {
    fontSize: 16,
    fontStyle: 'Raleway',
    color: "#242e49",
    textAlign: "center",
    marginTop:20,
  },
  // Style untuk footerNav (sama seperti di SettingsScreen.js atau DashboardScreen.js)
 footerNav: {
  flexDirection: 'row',
  justifyContent: 'space-around', 
  alignItems: 'center',          
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E0E0E0',
  paddingTop: 10,              
  paddingBottom: Platform.OS === 'ios' ? 60 : 40, 
},
footerNavItem: {
  flex: 1,                        // Setiap item mengambil lebar yang sama
  alignItems: 'center',           // Ikon di tengah item secara horizontal
  justifyContent: 'center',       // Ikon di tengah item secara vertikal
  paddingVertical: 10,            // Beri padding atas-bawah pada setiap item agar area sentuh lebih baik
                                  // dan ini juga akan berkontribusi pada tinggi footer.
},
illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 10,
  },
  illustrationImage: {
    width: 200, 
    height: 200, 
  },
});