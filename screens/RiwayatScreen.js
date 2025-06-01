// src/screens/RiwayatScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// Hanya import getAllAssessmentResults (getDBConnection akan dipanggil di dalamnya)
import { getAllAssessmentResults } from '../database/database'; // Sesuaikan path
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Fungsi untuk memformat tanggal (tetap sama)
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};


const formatTimestampToLocal = (isoString) => {
  //console.log('[RiwayatScreen] Original isoString received:', isoString); // <--- LOG 1: Lihat string asli

  if (!isoString) return 'Timestamp tidak valid';
  let correctedIsoString = isoString;
  if (typeof isoString === 'string' && isoString.includes(' ') && !isoString.includes('T') && !isoString.endsWith('Z') && !isoString.match(/[+-]\d{2}:\d{2}/)) {
    // Ini adalah upaya untuk mendeteksi format "YYYY-MM-DD HH:MM:SS"
    // dan mengubahnya menjadi format yang akan diinterpretasikan sebagai UTC oleh new Date()
    //console.log('[RiwayatScreen] Detected space-separated timestamp, attempting to mark as UTC by appending Z.');
    correctedIsoString = isoString.replace(' ', 'T') + 'Z';
     //console.log('[RiwayatScreen] Corrected isoString:', correctedIsoString);
  }


  const date = new Date(correctedIsoString); // Gunakan string yang mungkin sudah dikoreksi

  //console.log('[RiwayatScreen] Parsed Date object (toString):', date.toString());
  //console.log('[RiwayatScreen] Parsed Date object (toISOString):', date.toISOString());

  if (isNaN(date.getTime())) {
    console.error('[RiwayatScreen] Date parsing resulted in NaN for:', isoString, '(corrected to:', correctedIsoString, ')');
    return 'Format timestamp salah';
  }

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formatted = date.toLocaleString('id-ID', options);
  //console.log('[RiwayatScreen] Formatted timestamp by toLocaleString:', formatted);
  return formatted;
};



// Mapping untuk ikon dan judul berdasarkan tipe asesmen (tetap sama)
const assessmentInfo = {
  PHQ9: {
    title: 'Tingkat Stres',
    icon: require('../assets/images/MASEH IJO.png'), // Ganti dengan path ikon Anda yang sesuai
    getIndicator: (category) => {
      switch (category.toLowerCase()) {
        case 'parah': return { text: 'Parah', color: '#E53935', icon: 'arrow-down-bold-hexagon-outline', type: 'bar' };
        case 'berat': return { text: 'Berat', color: '#E53935', icon: 'arrow-down-bold-hexagon-outline', type: 'bar' };
        case 'sedang': return { text: 'Sedang', color: '#FFB300', icon: 'minus-box-outline', type: 'bar' };
        case 'ringan': return { text: 'Ringan', color: '#7CB342', icon: 'arrow-up-bold-hexagon-outline', type: 'bar' };
        case 'minimal': return { text: 'Minimal', color: '#43A047', icon: 'thumb-up-outline', type: 'thumb' };
        case 'minimal atau tidak ada gejala': return { text: 'Minimal', color: '#43A047', icon: 'thumb-up-outline', type: 'thumb' }; // Tambahkan ini jika kategori dari PHQ9 seperti ini
        case 'tidak ada': return { text: 'Tidak ada', color: '#BDBDBD', icon: 'minus', type: 'bar' };
        default: return { text: category, color: '#757575', icon: 'help-circle-outline', type: 'text' };
      }
    }
  },
  SleepQuality: {
    title: 'Kualitas Tidur',
    icon: require('../assets/images/MASEH IJO.png'), // Ganti dengan path ikon Anda yang sesuai
     getIndicator: (category) => {
      switch (category.toLowerCase()) {
        case 'sangat buruk': return { text: 'Sangat Buruk', color: '#D32F2F', icon: 'thumb-down-outline', type: 'thumb' };
        case 'buruk': return { text: 'Buruk', color: '#E53935', icon: 'thumb-down-outline', type: 'thumb' };
        case 'sedang': return { text: 'Sedang', color: '#FFB300', icon: 'minus-box-outline', type: 'bar' };
        case 'baik': return { text: 'Baik', color: '#43A047', icon: 'thumb-up-outline', type: 'thumb' };
        case 'sangat baik': return { text: 'Sangat Baik', color: '#2E7D32', icon: 'thumb-up-outline', type: 'thumb' };
        default: return { text: category, color: '#757575', icon: 'help-circle-outline', type: 'text' };
      }
    }
  },
  Lifestyle: {
    title: 'Gaya Hidup',
    icon: require('../assets/images/MASEH IJO.png'), // Ganti dengan path ikon Anda yang sesuai
    getIndicator: (category) => {
      switch (category.toLowerCase()) {
        case 'buruk': return { text: 'Buruk', color: '#E53935', icon: 'arrow-down-bold-hexagon-outline', type: 'bar' };
        case 'kurang': return { text: 'Kurang', color: '#FFB300', icon: 'minus-box-outline', type: 'bar' };
        case 'cukup': return { text: 'Cukup', color: '#FFEE58', icon: 'minus-box-outline', type: 'bar' };
        case 'baik': return { text: 'Baik', color: '#7CB342', icon: 'arrow-up-bold-hexagon-outline', type: 'bar' };
        case 'sangat baik': return { text: 'Sangat Baik', color: '#43A047', icon: 'thumb-up-outline', type: 'thumb' };
        default: return { text: category, color: '#757575', icon: 'help-circle-outline', type: 'text' };
      }
    }
  }
};

// Komponen RiwayatItem (tetap sama)
const RiwayatItem = ({ item, onPress }) => {
  const info = assessmentInfo[item.assessment_type] || { title: item.assessment_type, icon: require('../assets/images/MASEH IJO.png'), getIndicator: () => ({ text: item.category, color: '#757575', icon: 'help-circle-outline' }) };
  // Pastikan getIndicator dipanggil dengan benar
  const categoryForIndicator = item.category || ""; // Default ke string kosong jika undefined/null
  const indicator = info.getIndicator(categoryForIndicator);


  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Image source={info.icon} style={styles.itemIconImage} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{info.title}</Text>
        <View style={styles.indicatorContainer}>
          <Icon name={indicator.icon} size={18} color={indicator.color} style={styles.indicatorIcon} />
          <Text style={[styles.itemCategory, { color: indicator.color }]}>{indicator.text}</Text>
        </View>
      </View>
      <Text style={styles.itemDate}>{formatTimestampToLocal(item.timestamp)}</Text>
    </TouchableOpacity>
  );
};


export default function RiwayatScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      // --- PERUBAHAN DI SINI ---
      // Tidak perlu: const db = await getDBConnection();
      
      // Langsung panggil tanpa argumen 'db'
      const results = await getAllAssessmentResults();
      // --------------------------
      setHistory(results);
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistory([]); // Set ke array kosong jika ada error
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
    return <View style={styles.centered}><ActivityIndicator size="large" color="#00796B" /></View>;
  }

  if (history.length === 0) {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Riwayat</Text>
                {/* Placeholder untuk menyeimbangkan judul jika tidak ada tombol kanan */}
                <View style={{width: 24 + styles.headerLink.fontSize}} /> 
            </View>
            <View style={styles.centered}>
                <Text style={styles.emptyText}>Belum ada riwayat tersimpan.</Text>
            </View>
       </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat</Text>
        <TouchableOpacity onPress={loadHistory}>
          <Text style={styles.headerLink}>Semua Riwayat</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RiwayatItem
            item={item}
            onPress={() => navigation.navigate('RiwayatDetail', { assessmentId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

// Styles (tetap sama persis seperti yang Anda kirim sebelumnya)
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerLink: {
    fontSize: 14,
    color: '#007AFF',
  },
  listContentContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemIconImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorIcon: {
    marginRight: 5,
  },
  itemCategory: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 12,
    color: '#757575',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  }
});