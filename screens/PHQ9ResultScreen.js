// screens/PHQ9Result.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PHQ9Result({ route, navigation }) {
  const { score, category, advice } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hasil Tes PHQ-9</Text>
      <Text style={styles.score}>Skor: {score}</Text>
      <Text style={styles.category}>Kategori: {category}</Text>
      <Text style={styles.advice}>{advice}</Text>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => alert('Fitur simpan belum diimplementasikan')}
      >
        <Text style={styles.saveButtonText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  score: { fontSize: 18, marginBottom: 10 },
  category: { fontSize: 18, marginBottom: 10 },
  advice: { fontSize: 16, marginBottom: 30 },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 16 },
});
