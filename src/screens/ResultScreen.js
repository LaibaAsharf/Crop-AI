import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function ResultScreen({ route, navigation }) {
  const { imageUri, backendData } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 2 second animation effect
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Save scan to history when backend data is available
  useEffect(() => {
    if (backendData && !saved) {
      saveScanToHistory();
    }
  }, [backendData, saved]);

  // Function to save scan to database
  async function saveScanToHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const disease = backendData?.prediction?.disease || 'Unknown';
      const confidence = backendData?.prediction?.confidence || 0;

      // Determine status based on disease name
      let status = 'Disease Detected';
      if (disease.toLowerCase().includes('healthy')) {
        status = 'Healthy';
      } else if (disease.toLowerCase().includes('late blight')) {
        status = 'Critical';
      }

      // Save to database
      const { error } = await supabase
        .from('scan_history')
        .insert([{
          user_id: user.id,
          disease_name: disease,
          confidence: confidence / 100, // Convert percentage to decimal (0-1)
          status: status,
          image_url: imageUri,
        }]);

      if (error) {
        console.error('Error saving scan history:', error);
      } else {
        console.log('✅ Scan saved to history successfully!');
        setSaved(true);
      }
    } catch (error) {
      console.error('Error in saveScanToHistory:', error);
    }
  }

  // Parse backend data
  const disease = backendData?.prediction?.disease || 'Unknown';
  const confidence = backendData?.prediction?.confidence || 0;
  const allPredictions = backendData?.prediction?.all_predictions || {};
  const recommendation = backendData?.recommendation || {};

  // Map disease to status and color
  const getStatusInfo = (diseaseName) => {
    if (diseaseName === 'Healthy') {
      return { status: 'Healthy', color: '#388E3C' };
    } else if (diseaseName === 'Late Blight') {
      return { status: 'Critical', color: '#C62828' };
    } else {
      return { status: 'Infected', color: '#d32f2f' };
    }
  };

  const statusInfo = getStatusInfo(disease);

  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E5631" />
        </TouchableOpacity>
      </View>

      {/* Scan Overlay Effect */}
      {loading && (
        <View style={styles.overlay}>
           <View style={styles.scanBox} />
           <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
           <Text style={styles.scanText}>Analyzing Plant with AI...</Text>
        </View>
      )}

      {/* Result Sheet */}
      {!loading && backendData && (
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.matchLabel}>AI Analysis Complete</Text>
                <Text style={styles.diseaseTitle}>{disease}</Text>
                {recommendation.description && (
                  <Text style={styles.scientific}>{recommendation.description.substring(0, 60)}...</Text>
                )}
              </View>
              <View style={[styles.statusBadge, {backgroundColor: statusInfo.color}]}>
                <Text style={styles.statusText}>{statusInfo.status}</Text>
              </View>
            </View>

            {/* Saved indicator */}
            {saved && (
              <View style={styles.savedBanner}>
                <Ionicons name="checkmark-circle" size={16} color="#388E3C" />
                <Text style={styles.savedText}>Saved to history</Text>
              </View>
            )}

            {/* Confidence Bar */}
            <View style={styles.confRow}>
              <Text style={styles.confLabel}>Model Confidence</Text>
              <Text style={[styles.confValue, {color: statusInfo.color}]}>
                {confidence.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.progressBarBg}>
               <View style={[
                 styles.progressBarFill, 
                 {width: `${confidence}%`, backgroundColor: statusInfo.color}
               ]} />
            </View>

            {/* All Predictions */}
            <View style={styles.infoBox}>
               <Text style={styles.label}>All Predictions</Text>
               {Object.entries(allPredictions).map(([name, prob]) => (
                 <View key={name} style={styles.predictionRow}>
                   <Text style={styles.predictionName}>{name}</Text>
                   <Text style={styles.predictionValue}>{prob.toFixed(1)}%</Text>
                 </View>
               ))}
            </View>

            {/* Description */}
            {recommendation.description && (
              <View style={styles.infoBox}>
                <Text style={styles.label}>About This Condition</Text>
                <Text style={styles.desc}>{recommendation.description}</Text>
              </View>
            )}

            {/* Treatment */}
            {recommendation.treatment && recommendation.treatment.length > 0 && (
              <View style={[styles.infoBox, {backgroundColor: '#FFF3E0'}]}>
                <Text style={[styles.label, {color: '#E65100'}]}>
                  <Ionicons name="medical" size={16} /> Treatment Steps
                </Text>
                {recommendation.treatment.map((step, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={[styles.desc, {color: '#BF360C', flex: 1}]}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Prevention */}
            {recommendation.prevention && recommendation.prevention.length > 0 && (
              <View style={[styles.infoBox, {backgroundColor: '#E8F5E9'}]}>
                <Text style={[styles.label, {color: '#2E7D32'}]}>
                  <Ionicons name="shield-checkmark" size={16} /> Prevention Tips
                </Text>
                {recommendation.prevention.map((tip, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={[styles.desc, {color: '#1B5E20', flex: 1}]}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.btn} 
              onPress={() => navigation.navigate('Feedback')}
            >
              <Text style={styles.btnText}>Rate This Diagnosis</Text>
              <Ionicons name="star" size={18} color="#fff" style={{marginLeft: 5}} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnOutline} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.btnOutlineText}>Scan Another Plant</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  imageContainer: { width: width, height: height * 0.6 },
  image: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 5 },
  
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#4CAF50', borderStyle: 'dashed', borderRadius: 20 },
  scanText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 15 },

  sheet: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: '55%', 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    padding: 25,
    paddingBottom: 10
  },
  handle: { width: 50, height: 5, backgroundColor: '#ddd', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    gap: 6,
  },
  savedText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  matchLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  diseaseTitle: { fontSize: 26, fontWeight: 'bold', color: '#1E5631', marginTop: 5 },
  scientific: { fontSize: 13, color: '#666', marginTop: 5 },
  
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  confRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  confLabel: { color: '#333', fontWeight: 'bold', fontSize: 14 },
  confValue: { fontWeight: 'bold', fontSize: 16 },
  progressBarBg: { height: 6, backgroundColor: '#eee', borderRadius: 3, marginBottom: 20 },
  progressBarFill: { height: '100%', borderRadius: 3 },

  predictionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  predictionName: { fontSize: 14, color: '#555' },
  predictionValue: { fontSize: 14, fontWeight: 'bold', color: '#1E5631' },

  infoBox: { 
    marginBottom: 15, 
    padding: 15, 
    backgroundColor: '#F9F9F9', 
    borderRadius: 15 
  },
  label: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8 
  },
  desc: { 
    fontSize: 14, 
    color: '#555', 
    lineHeight: 22 
  },
  listItem: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 5
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#555'
  },

  btn: { 
    backgroundColor: '#1E5631', 
    padding: 16, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 10
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: '#1E5631',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20
  },
  btnOutlineText: {
    color: '#1E5631',
    fontWeight: 'bold',
    fontSize: 16
  }
});