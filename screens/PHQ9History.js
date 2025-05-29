import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchResults } from '../database/database';

export default function PHQ9History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchResults().then(setHistory).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Tes PHQ-9</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>🗓️ {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Skor: {item.score}</Text>
            <Text>Kategori: {item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6f8' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
