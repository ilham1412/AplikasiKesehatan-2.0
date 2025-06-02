// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAppSetting } from '../database/database';

// ... (const iconDepresi, iconTidur, dll. dan menuItems tetap sama) ...
const iconDepresi = require('../assets/gambar/depression.png');
const iconTidur = require('../assets/gambar/kualitas bobok.png');
const iconGayaHidup = require('../assets/gambar/gaya hidup.png');
const iconFirstAid = require('../assets/gambar/panduan pertolongan.png');

const menuItems = [
  { id: '1', title: 'Mengukur Tingkat Depresi', image: iconDepresi, navigateTo: 'Panduan1'},
  { id: '2', title: 'Mengukur Kualitas Tidur', image: iconTidur, navigateTo: 'Panduan3'},
  { id: '3', title: 'Cek Gaya Hidup', image: iconGayaHidup, navigateTo: 'Panduan2'},
  { id: '4', title: 'Panduan Pertolongan Pertama', image: iconFirstAid, navigateTo: 'FirstAid'},
];


export default function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await getAppSetting('userName');
        if (name !== null) {
          setUserName(name);
        }
      } catch (e) {
        console.error("Gagal mengambil nama dari SQLite untuk Dashboard:", e);
      }
    };
    fetchUserName();
  // Jika Anda tidak menggunakan 'navigation' di dalam useEffect ini secara langsung
  // untuk memicu pembaruan, Anda bisa menghapusnya dari array dependensi.
  // }, [navigation]); 
  }, []); // Array dependensi kosong jika hanya dijalankan sekali saat mount

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer} // Tambahkan ini
        showsVerticalScrollIndicator={false} // Opsional: hilangkan scrollbar vertikal
      >
        <View style={styles.header}>
          <Icon name="hand-wave-outline" size={30} color="#FFA726" style={styles.waveIcon} />
          <Text style={styles.greetingText}>
            Halo {userName || 'Pengguna'}!
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.navigateTo)}
            >
                <View style={styles.menuTextContainer}>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Image source={item.image} style={styles.menuItemImage} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer Navigasi */}
      <View style={styles.footerNav}>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => console.log("Navigasi ke Dashboard (sudah di sini)")}>
          <Icon name="view-dashboard-outline" size={28} color="#00695C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Riwayat')}>
          <Icon name="history" size={28} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog-outline" size={28} color="#757575" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    // paddingTop untuk status bar Android sebaiknya dihandle oleh ScrollView atau View konten utama jika footer benar-benar di luar SafeArea
    // Namun, jika SafeAreaView membungkus semuanya, paddingTop di sini untuk Android sudah benar.
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1, // Ini penting agar ScrollView mengambil ruang yang tersedia
  },
  scrollContentContainer: { // Style untuk konten di dalam ScrollView
    paddingBottom: 20, // Beri ruang di bawah item menu terakhir
                       // agar tidak terlalu mepet footer saat di-scroll penuh
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  waveIcon: {
    marginRight: 10,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    backgroundColor: '#E0F2F1',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuTextContainer: {
      flex: 1,
      marginRight: 10,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#004D40',
    flexShrink: 1,
  },
  menuItemImage: {
    width: 80,
    height: 80,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    
    // --- COBA TINGKATKAN NILAI DI SINI ---
    paddingTop: 10, // Padding atas untuk ikon di dalam footer
    paddingBottom: Platform.OS === 'ios' ? 60 : 40, // Tingkatkan padding bawah (misal: iOS dari 30 ke 40, Android dari 10 ke 25)
    // Atau, jika Anda ingin tinggi footer tetap, dan hanya ingin ikon lebih ke atas,
    // Anda bisa mengatur height dan menggunakan justifyContent atau paddingTop yang lebih besar
    // Untuk sekarang, kita coba dengan menambah paddingBottom.
    // Anda juga bisa mencoba menambah height jika paddingBottom saja tidak cukup:
    // height: Platform.OS === 'ios' ? 100 : 75, // Contoh peningkatan tinggi
  },
  footerNavItem: {
    flex: 1, // Agar setiap item mengambil ruang yang sama
    alignItems: 'center',
    justifyContent: 'center', // Pusatkan ikon
    paddingVertical: 10, // Beri padding vertikal pada item agar area sentuh lebih baik
                         // Ini akan menambah tinggi efektif jika height footer tidak di-set eksplisit
  },
});