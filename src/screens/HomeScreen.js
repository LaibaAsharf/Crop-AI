import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Dimensions, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { predictDisease, checkBackendHealth } from '../lib/api';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [backendStatus, setBackendStatus] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    checkBackend();
    requestPermissions();
    getProfile();
  }, []);

  // Add listener for when screen comes into focus (to refresh profile pic)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
    });
    return unsubscribe;
  }, [navigation]);

  // Fetch user profile
  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  // Check if backend is online
  async function checkBackend() {
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy);
    if (!isHealthy) {
      Alert.alert(
        'Backend Offline',
        'Make sure your Python backend is running:\npython backend.py',
        [{ text: 'OK' }]
      );
    }
  }

  // Request camera and gallery permissions
  async function requestPermissions() {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library permissions are needed.'
      );
    }
  }

  // --- REAL AI SCAN FUNCTION (Connected to Backend) ---
  const handleScan = async (type) => {
    // Check backend status first
    if (!backendStatus) {
      Alert.alert(
        'Backend Not Connected',
        'Please start your Python backend:\n\npython backend.py\n\nThen tap the refresh button in the top.',
        [
          { text: 'Retry', onPress: checkBackend },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    let result;
    if (type === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ['images'], 
        allowsEditing: true, 
        quality: 0.8 
      });
    } else {
      let perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return alert("Camera permission required!");
      result = await ImagePicker.launchCameraAsync({ 
        allowsEditing: true, 
        quality: 0.8 
      });
    }

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      
      // Show scanning state
      setScanning(true);
      
      try {
        // Call REAL backend API
        console.log('Sending image to backend...');
        const backendResponse = await predictDisease(imageUri);
        
        console.log('Backend response:', backendResponse);
        
        // Navigate to result screen with REAL data
        navigation.navigate('Result', { 
          imageUri: imageUri,
          backendData: backendResponse // Real data from your FastAPI
        });
        
      } catch (error) {
        console.error('Scan error:', error);
        Alert.alert(
          'Scan Failed',
          error.message || 'Could not analyze the image. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setScanning(false);
      }
    }
  };

  // Menu Logic
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const navigateTo = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  // Get user initials for avatar placeholder
  const getUserInitial = () => {
    if (profile?.first_name) return profile.first_name[0].toUpperCase();
    if (profile?.last_name) return profile.last_name[0].toUpperCase();
    if (profile?.email) return profile.email[0].toUpperCase();
    return '?';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9E6" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
           <Ionicons name="menu" size={28} color="#1E5631" />
        </TouchableOpacity>
        <Text style={styles.logoText}>CROP AI</Text>
        <View style={styles.headerRight}>
          {/* Backend Status Indicator */}
          <TouchableOpacity onPress={checkBackend} style={styles.statusBtn}>
            <View style={[styles.statusDot, { 
              backgroundColor: backendStatus ? '#4CAF50' : '#F44336' 
            }]} />
          </TouchableOpacity>
          
          {/* Profile Picture */}
          <TouchableOpacity onPress={() => navigateTo('Profile')}>
            {profile?.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }} 
                style={styles.profileAvatar}
                key={profile.avatar_url} // Force re-render when URL changes
              />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Text style={styles.profileAvatarText}>
                  {getUserInitial()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Backend Status Banner */}
        {!backendStatus && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={20} color="#FF6B6B" />
            <Text style={styles.warningText}>
              Backend Offline - Start your Python server
            </Text>
          </View>
        )}

        {/* Banner */}
        <LinearGradient colors={['#1E5631', '#2E7D32']} style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTag}>AI POWERED • REAL-TIME</Text>
            <Text style={styles.bannerTitle}>Scan & Save Your Crop</Text>
            <Text style={styles.bannerSub}>TensorFlow model for potato disease detection.</Text>
          </View>
          <Ionicons name="leaf" size={80} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
        </LinearGradient>

        {/* Buttons */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity 
            style={[styles.actionCard, !backendStatus && styles.disabledCard]} 
            onPress={() => handleScan('gallery')}
            disabled={scanning || !backendStatus}
          >
            <View style={[styles.iconCircle, {backgroundColor: '#E8F5E9'}]}>
              <Ionicons name="images" size={24} color="#2E7D32" />
            </View>
            <Text style={styles.actionText}>Gallery Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('History')}>
            <View style={[styles.iconCircle, {backgroundColor: '#FFF3E0'}]}>
              <Ionicons name="time" size={24} color="#E65100" />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <Text style={styles.sectionTitle}>Daily Tips</Text>
        <View style={styles.tipCard}>
          <Image source={{uri: 'https://img.freepik.com/free-photo/potato-field_1157-19409.jpg'}} style={styles.tipImage} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Watering Schedule</Text>
            <Text style={styles.tipDesc}>Water early morning to prevent fungal growth.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#1E5631" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.scanButtonOuter} 
          onPress={() => handleScan('camera')}
          disabled={scanning || !backendStatus}
        >
          <LinearGradient colors={['#1E5631', '#4CAF50']} style={styles.scanButton}>
            {scanning ? (
              <Ionicons name="hourglass" size={32} color="#fff" />
            ) : (
              <Ionicons name="camera" size={32} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#999" />
          <Text style={[styles.navText, {color: '#999'}]}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal animationType="fade" transparent={true} visible={menuVisible} onRequestClose={toggleMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
          <View style={styles.menuBox}>
            <Text style={styles.menuHeader}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Profile')}>
              <Ionicons name="person" size={20} color="#333" />
              <Text style={styles.menuText}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('History')}>
              <Ionicons name="time" size={20} color="#333" />
              <Text style={styles.menuText}>Scan History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Settings')}>
              <Ionicons name="settings" size={20} color="#333" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={checkBackend}>
              <Ionicons name="refresh" size={20} color="#1E5631" />
              <Text style={[styles.menuText, {color: '#1E5631'}]}>Check Backend</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#1E5631', letterSpacing: 2 },
  statusBtn: { padding: 5 },
  statusDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1E5631',
  },
  profileAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E5631',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E5631',
  },
  profileAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  warningBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFE5E5', padding: 12, borderRadius: 10, marginBottom: 15, gap: 10 },
  warningText: { flex: 1, color: '#C62828', fontSize: 13, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  banner: { borderRadius: 20, padding: 25, marginBottom: 30, height: 160, justifyContent: 'center' },
  bannerTag: { color: '#A5D6A7', fontWeight: 'bold', fontSize: 12, marginBottom: 5 },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', width: '80%' },
  bannerSub: { color: '#E8F5E9', marginTop: 5, fontSize: 13 },
  bannerIcon: { position: 'absolute', right: 0, bottom: -10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionCard: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 2 },
  disabledCard: { opacity: 0.5 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionText: { fontWeight: '600', color: '#333' },
  tipCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 10, elevation: 2 },
  tipImage: { width: 80, height: 80, borderRadius: 10 },
  tipContent: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  tipTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  tipDesc: { color: '#666', fontSize: 12 },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', height: 80, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  navItem: { alignItems: 'center', top: 5 },
  navText: { fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  scanButtonOuter: { top: -25, elevation: 10 },
  scanButton: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF9E6' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuBox: { width: '70%', height: '100%', backgroundColor: '#fff', padding: 25, paddingTop: 60, elevation: 10 },
  menuHeader: { fontSize: 24, fontWeight: 'bold', color: '#1E5631', marginBottom: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { fontSize: 16, color: '#333', marginLeft: 15 },
  menuDivider: { height: 1, backgroundColor: '#eee', marginVertical: 10 }
});