// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAppSetting, setAppSetting } from '../database/database.js'; // Sesuaikan path

export default function SettingsScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await getAppSetting('userName');
        if (name !== null) {
          setUserName(name);
        }
      } catch (e) {
        console.error("Gagal mengambil nama untuk SettingsScreen:", e);
      }
    };
    fetchUserName();
    // Di sini Anda juga bisa mengambil preferensi mode gelap jika sudah disimpan
    // Contoh:
    // const fetchDarkModePreference = async () => {
    //   const darkModePref = await getAppSetting('isDarkMode');
    //   if (darkModePref === 'true') {
    //     setIsDarkMode(true);
    //   }
    // };
    // fetchDarkModePreference();
  }, []);

  const handleEditName = () => {
    Alert.alert("Edit Nama", "Fitur untuk mengedit nama akan segera hadir!");
    // Nanti bisa navigasi ke screen edit nama atau munculkan modal
    // navigation.navigate('EditNamaScreen', { currentName: userName });
  };

  const toggleDarkMode = async (value) => {
    setIsDarkMode(value);
    try {
      // Simpan preferensi mode gelap ke database
      await setAppSetting('isDarkMode', value.toString()); // Simpan sebagai string 'true' atau 'false'
      console.log("Preferensi Mode Gelap disimpan:", value);
      // Di sini Anda akan memicu perubahan tema di seluruh aplikasi
      // (Ini memerlukan implementasi theming yang lebih luas, misalnya dengan Context API)
      Alert.alert("Mode Gelap", `Mode Gelap ${value ? "diaktifkan" : "dinonaktifkan"}. Restart aplikasi mungkin diperlukan untuk melihat perubahan penuh.`);
    } catch (error) {
        console.error("Gagal menyimpan preferensi Mode Gelap:", error);
        Alert.alert("Error", "Gagal menyimpan preferensi Mode Gelap.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Nama Pengguna</Text>
            <Text style={styles.userNameText}>{userName || 'Belum diatur'}</Text>
          </View>
          <TouchableOpacity onPress={handleEditName} style={styles.editButton}>
            <Icon name="pencil-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />

        {/* Bagian Mode Gelap */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mode Gelap</Text>
          <Switch
            trackColor={{ false: "#E0E0E0", true: "#4DB6AC" }}
            thumbColor={isDarkMode ? "#00796B" : "#f4f3f4"}
            ios_backgroundColor="#E0E0E0"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>
        <View style={styles.separator} />

        {/* Bagian Tentang Kami */}
        <TouchableOpacity 
          style={styles.settingItemClickable} 
          onPress={() => navigation.navigate('AboutUs')}
        >
          <Text style={styles.settingLabel}>Tentang Kami</Text>
          <Icon name="chevron-right" size={24} color="#C7C7CC" />
        </TouchableOpacity>
        <View style={styles.separator} />
      </ScrollView>

      {/* Footer Navigasi DIPINDAHKAN KE LUAR ScrollView */}
      <View style={styles.footerNav}>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="view-dashboard-outline" size={28} color="#757575" /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Riwayat')}>
          <Icon name="history" size={28} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNavItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog-outline" size={28} color="#00695C" /> 
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
  header: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00695C', 
  },
  // scrollContainer adalah untuk content di dalam ScrollView
  scrollContainer: {
    paddingBottom: 20, // Beri ruang di bawah konten terakhir sebelum footer
    // paddingVertical: 10, // Dihapus, karena header sudah punya padding, dan footer di luar
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  settingItemClickable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18, 
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    color: '#333333',
  },
  userNameText: {
    fontSize: 15,
    color: '#757575', 
    marginTop: 2,
  },
  editButton: {
    padding: 8, 
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  // Style untuk footerNav (seperti di DashboardScreen.js)
  footerNav: {
  flexDirection: 'row',
  justifyContent: 'space-around', // Agar ikon tersebar rata
  alignItems: 'center',          // Agar ikon terpusat secara vertikal di dalam tinggi footer
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E0E0E0',
  paddingTop: 10,                // Jarak dari garis atas footer ke bagian atas ikon
  paddingBottom: Platform.OS === 'ios' ? 60 : 40, // MULAI DENGAN NILAI INI untuk Android (25). 
                                                 // Untuk iOS 35 (30 untuk home indicator + 5px buffer).
                                                 // NAIKKAN NILAI UNTUK ANDROID JIKA 25 MASIH KURANG.
  // HAPUS ATAU KOMENTARI PROPERTI 'height' DARI SINI:
  // height: Platform.OS === 'ios' ? 80 : 60, 
},
footerNavItem: {
  flex: 1,                        // Setiap item mengambil lebar yang sama
  alignItems: 'center',           // Ikon di tengah item secara horizontal
  justifyContent: 'center',       // Ikon di tengah item secara vertikal
  paddingVertical: 10,            // Beri padding atas-bawah pada setiap item agar area sentuh lebih baik
                                  // dan ini juga akan berkontribusi pada tinggi footer.
},
});