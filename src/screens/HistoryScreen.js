import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function HistoryScreen({ navigation }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Add listener for when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  async function fetchHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setHistoryData(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      Alert.alert('Error', 'Failed to load scan history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchHistory();
  }

  async function deleteHistoryItem(id) {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('scan_history')
                .delete()
                .eq('id', id);

              if (error) throw error;

              // Remove from local state
              setHistoryData(historyData.filter(item => item.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete scan');
            }
          }
        }
      ]
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Today
    if (diffDays === 0) {
      if (diffMins < 60) {
        return `Today, ${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
      }
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    // Yesterday
    if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    // This week
    if (diffDays < 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `${days[date.getDay()]}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    // Older
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getStatusColor(status) {
    switch(status.toLowerCase()) {
      case 'healthy':
        return '#388E3C';
      case 'critical':
        return '#d32f2f';
      case 'disease detected':
        return '#F57C00';
      default:
        return '#666';
    }
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Scan History</Text>
        <Text style={styles.emptyText}>
          Your scan history will appear here after you perform your first scan
        </Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E5631" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E5631" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan History</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#1E5631" />
        </TouchableOpacity>
      </View>

      {historyData.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Text style={styles.subtitle}>
            Last {historyData.length} scan{historyData.length !== 1 ? 's' : ''}
          </Text>
          
          <FlatList
            data={historyData}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: getStatusColor(item.status) }]}>
                  <Ionicons 
                    name={item.status.toLowerCase() === 'healthy' ? 'checkmark-circle' : 'warning'} 
                    size={24} 
                    color="#fff" 
                  />
                </View>
                
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.name}>{item.disease_name}</Text>
                  <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                  {item.confidence && (
                    <Text style={styles.confidence}>
                      Confidence: {(item.confidence * 100).toFixed(1)}%
                    </Text>
                  )}
                </View>
                
                <View style={styles.rightSection}>
                  <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => deleteHistoryItem(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF9E6', 
    padding: 20 
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E5631' 
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15, 
    alignItems: 'center', 
    elevation: 2 
  },
  iconBox: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  date: { 
    fontSize: 12, 
    color: '#888',
    marginTop: 2,
  },
  confidence: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  status: { 
    fontSize: 12, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deleteBtn: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#1E5631',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 30,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});