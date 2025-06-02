// screens/AboutUsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AboutUsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tentang Kami</Text>
        <View style={{ width: 24 }} /> 
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Maseh App</Text>
        <Text style={styles.paragraph}>
          Selamat datang di Maseh App! Aplikasi ini dirancang untuk membantu Anda memantau dan meningkatkan kesejahteraan mental dan gaya hidup Anda.
        </Text>
        <Text style={styles.paragraph}>
          Kami percaya bahwa kesehatan mental adalah bagian penting dari kesehatan secara keseluruhan. Dengan Maseh App, Anda dapat:
        </Text>
        <Text style={styles.listItem}>• Mengukur tingkat stres Anda secara berkala.</Text>
        <Text style={styles.listItem}>• Memantau kualitas tidur Anda.</Text>
        <Text style={styles.listItem}>• Mengevaluasi gaya hidup Anda.</Text>
        <Text style={styles.listItem}>• Mendapatkan panduan pertolongan pertama untuk situasi darurat sederhana.</Text>
        <Text style={styles.paragraph}>
          Aplikasi ini dikembangkan oleh [Nama Anda/Nama Tim Anda/Nama Organisasi Anda]. Kami berkomitmen untuk terus mengembangkan Maseh App agar menjadi teman setia Anda dalam perjalanan menuju kesejahteraan.
        </Text>
        <Text style={styles.paragraph}>
          Terima kasih telah menggunakan Maseh App!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00695C', // Warna hijau Maseh
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 8,
    marginLeft: 10,
  }
});