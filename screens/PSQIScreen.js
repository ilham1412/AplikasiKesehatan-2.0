import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PSQIScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman PSQI (Gaya Tidur)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
