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
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
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
                <View style={styles.menuImageContainer}>
                    <Image source={item.image} style={styles.menuItemImage} resizeMode="contain" />
                </View>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
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
    flexDirection: 'row',
    alignItems: 'stretch', // Changed from 'center' to 'stretch'
    marginBottom: 15,
    height: 100, // Fixed height instead of minHeight
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden', // This ensures the image doesn't overflow the rounded corners
  },
  menuTextContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 10,
    justifyContent: 'center', // Center the text vertically
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#004D40',
    flexShrink: 1,
  },
  menuImageContainer: {
    width: 100, // Fixed width for image container
    height: '100%', // Full height of the card
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10, // Small padding from right edge
  },
  menuItemImage: {
    width: 120,
    height: 100,
  },
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});