import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Contoh menggunakan MaterialCommunityIcons

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.overallContainer}>
      
      <View style={styles.headerContainer}>
      <Image
      source={require('../assets/images/MASEH IJO.png')}  //path
      style={styles.logoImage}
      resizeMode="contain"
      />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[styles.gridButton, styles.gridButtonTeal]}
            onPress={() => navigation.navigate('Panduan')} // Navigasi ke PHQ9
          >
            <Icon name="emoticon-happy-outline" size={40} color="#fff" />
            <Text style={[styles.gridButtonText, styles.gridButtonTextDark]}>Stress</Text>
            <Text>Mengukur tingkat stress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridButton, styles.gridButtonLightTeal]}
            onPress={() => navigation.navigate('FirstAid')} // Navigasi ke FirstAid
          >
            <Icon name="heart-pulse" size={40} color="#004D40" />
            <Text style={[styles.gridButtonText, styles.gridButtonTextDark]}>Pertolongan Pertama</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridButton, styles.gridButtonLightTeal]}
            onPress={() => navigation.navigate('Lifestyle')} // Navigasi ke Lifestyle
          >
            <Icon name="dumbbell" size={40} color="#004D40" />
            <Text style={[styles.gridButtonText, styles.gridButtonTextDark]}>Gaya Hidup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridButton, styles.gridButtonTeal]}
            onPress={() => navigation.navigate('PSQI')} // Navigasi ke PSQI
          >
            <Icon name="bed-outline" size={40} color="white" />
            <Text style={styles.gridButtonText}>Kualitas Tidur</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')} // Ganti 'History' dengan nama screen riwayat Anda
        >
          <Text style={styles.historyButtonText}>Cek riwayat pengisian</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Warna latar belakang keseluruhan (mirip gambar)
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    // backgroundColor: '#C8E6C9', // Jika header memiliki background berbeda
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

  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    elevation: 5, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridButton: {
    width: '48%', // Sekitar setengah lebar dengan sedikit spasi
    aspectRatio: 1, // Membuat tombol menjadi persegi
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridButtonTeal: {
    backgroundColor: '#4DB6AC', // Warna teal dari gambar
  },
  gridButtonLightTeal: {
    backgroundColor: '#A5D6A7', // Warna teal muda dari gambar
  },
  gridButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  gridButtonTextDark: {
    color: '#004D40', // Warna teks lebih gelap untuk background terang
  },
  historyButton: {
    backgroundColor: '#4DB6AC', // Warna teal dari gambar
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});