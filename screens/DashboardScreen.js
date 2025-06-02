// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView, // Untuk area aman di atas dan bawah
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAppSetting } from '../database/database'; // Sesuaikan path jika perlu

// Placeholder path untuk gambar, ganti dengan path Anda yang sebenarnya
const iconDepresi = require('../assets/gambar/depression.png'); // Ganti nama file
const iconTidur = require('../assets/gambar/kualitas bobok.png');     // Ganti nama file
const iconGayaHidup = require('../assets/gambar/gaya hidup.png'); // Ganti nama file
const iconFirstAid = require('../assets/gambar/panduan pertolongan.png'); // Ganti nama file

// Data untuk item menu, agar lebih mudah dikelola
const menuItems = [
  {
    id: '1',
    title: 'Mengukur Tingkat Depresi',
    image: iconDepresi,
    navigateTo: 'Panduan1', // Sesuaikan dengan nama route kuis PHQ9 Anda
    // Anda bisa menambahkan screen kuisnya langsung jika 'Panduan1' adalah perantara
    // navigateTo: 'PHQ9', 
  },
  {
    id: '2',
    title: 'Mengukur Kualitas Tidur',
    image: iconTidur,
    navigateTo: 'Panduan3', // Sesuaikan dengan nama route kuis Kualitas Tidur (PSQI) Anda
    // navigateTo: 'PSQI',
  },
  {
    id: '3',
    title: 'Cek Gaya Hidup',
    image: iconGayaHidup,
    navigateTo: 'Panduan2', // Sesuaikan dengan nama route kuis Gaya Hidup Anda
    // navigateTo: 'Lifestyle',
  },
  {
    id: '4',
    title: 'Panduan Pertolongan Pertama',
    image: iconFirstAid,
    navigateTo: 'FirstAid', // Nama route untuk Pertolongan Pertama
  },
];

export default function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await getAppSetting('userName');
        if (name !== null) {
          setUserName(name);
        } else {
          // Jika nama tidak ada, mungkin arahkan ke NamaPenggunaScreen atau biarkan kosong
          // navigation.replace('NamaPengguna'); // Opsional, jika nama wajib ada
        }
      } catch (e) {
        console.error("Gagal mengambil nama dari SQLite untuk Dashboard:", e);
      }
    };
    fetchUserName();
  }, [navigation]); // Tambahkan navigation jika ada logika navigasi di dalam useEffect

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.navigateTo)}
    >
      <Text style={styles.menuItemText}>{item.title}</Text>
      <Image source={item.image} style={styles.menuItemImage} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.scrollView}>
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
          {/* <Text style={styles.footerNavText}>Home</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Riwayat')}>
          <Icon name="history" size={28} color="#757575" />
          {/* <Text style={styles.footerNavText}>Riwayat</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog-outline" size={28} color="#757575" />
          {/* <Text style={styles.footerNavText}>Setelan</Text> */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Latar belakang utama putih
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Untuk Android
  },
  scrollView: {
    flex: 1, // Biarkan ScrollView mengambil ruang yang tersedia sebelum footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Jarak dari atas
    paddingBottom: 20, // Jarak ke konten menu
  },
  waveIcon: {
    marginRight: 10,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333', // Warna teks sapaan
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    backgroundColor: '#E0F2F1', // Warna latar item menu (hijau muda/mint)
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 100, // Tinggi minimal item
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuTextContainer: {
      flex: 1, // Agar teks mengambil ruang yang tersedia
      marginRight: 10, // Jarak antara teks dan gambar
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#004D40', // Warna teks item menu (hijau tua)
    flexShrink: 1, // Memungkinkan teks untuk wrap jika terlalu panjang
  },
  menuItemImage: {
    width: 80, // Sesuaikan ukuran gambar ilustrasi
    height: 80, // Sesuaikan ukuran gambar ilustrasi
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Latar belakang footer
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0', // Garis pemisah tipis
    paddingVertical: Platform.OS === 'ios' ? 20 : 10, // Padding vertikal, lebih banyak untuk iOS karena notch
    paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Padding bawah khusus iOS
    height: Platform.OS === 'ios' ? 90 : 60, // Tinggi footer
  },
  footerNavItem: {
    alignItems: 'center',
    padding: 5, // Area sentuh yang lebih besar
  },
  // footerNavText: { // Jika Anda ingin menambahkan teks di bawah ikon footer
  //   fontSize: 10,
  //   color: '#757575', // Warna teks footer
  //   marginTop: 2,
  // },
});