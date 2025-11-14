import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navbar from './Navbar';
import Footer from './Footer';

export default function DefaultLayout({ children, navigation }) {
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} /> {/* Navbar nhận navigation */}
      <ScrollView contentContainerStyle={styles.content}>
        {children}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f', 
  },
  content: {
    flexGrow: 1,
  },
});
