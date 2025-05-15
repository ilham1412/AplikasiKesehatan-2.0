import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Contoh menggunakan MaterialCommunityIcons

export default function PanduanScreen({ navigation }) {
  return (
    <ScrollView style={styles.overallContainer}>
      
      <View style={styles.headerContainer}>
      <Image
      source={require('../assets/images/MASEH IJO.png')}  //path
      style={styles.logoImage}
      resizeMode="contain"
      />
      </View>

    <View style={styles.container}>
      <Text style={styles.title}>Panduan Pengisian PHQ-9</Text>
      <Text style={styles.text}>
        PHQ-9 adalah kuesioner untuk mengukur tingkat stres atau depresi.
        Jawablah setiap pertanyaan berdasarkan kondisi kamu selama 2 minggu terakhir.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PHQ9')}
      >
        <Text style={styles.buttonText}>Mulai</Text>
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
  
  button: {
  backgroundColor: '#4DB6AC', // warna teal seperti di Dashboard
  paddingVertical: 14,
  paddingHorizontal: 30,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 20,
  elevation: 3, // shadow Android
  shadowColor: '#000', // shadow iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},

buttonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 'bold',
},

});