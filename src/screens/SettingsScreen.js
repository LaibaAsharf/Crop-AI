import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 40, marginBottom: 20}}>
        <Ionicons name="arrow-back" size={24} color="#1E5631" />
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={false} />
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={true} trackColor={{true: '#1E5631'}} />
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Language</Text>
        <Text style={{color: '#666'}}>English</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1E5631', marginBottom: 30 },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 18, color: '#333' }
});