import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');

  // Tags for feedback
  const tags = ["Inaccurate Result", "Slow Loading", "App Crashed", "Hard to Use", "Other"];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    // Show Professional Popup
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <Ionicons name="arrow-back" size={24} color="#1E5631" />
          </TouchableOpacity>
          <Text style={styles.title}>Rate Experience</Text>
        </View>

        <Text style={styles.subtitle}>How accurate was the diagnosis?</Text>

        {/* 1. Star Rating */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={42} 
                color={star <= rating ? "#FFC107" : "#D1D1D1"} 
                style={{marginHorizontal: 8}} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Feedback Tags (Chips) */}
        <Text style={styles.label}>What can be improved?</Text>
        <View style={styles.tagContainer}>
          {tags.map((tag) => (
            <TouchableOpacity 
              key={tag} 
              style={[styles.tag, selectedTags.includes(tag) && styles.selectedTag]} 
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagText, selectedTags.includes(tag) && styles.selectedTagText]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Comment Box */}
        <Text style={styles.label}>Additional Comments</Text>
        <View style={styles.inputBox}>
          <TextInput 
            placeholder="Tell us more about your experience..." 
            placeholderTextColor="#999" 
            multiline 
            style={styles.input} 
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit Feedback</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- PROFESSIONAL SUCCESS MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            {/* Green Check Circle */}
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={50} color="#fff" />
            </View>

            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>
              Your feedback helps us improve the AI accuracy.
            </Text>

            <TouchableOpacity 
              style={styles.modalBtn} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.modalBtnText}>Back to Home</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6' },
  scrollContent: { padding: 25 },
  
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 30 },
  backBtn: { padding: 10, borderRadius: 10, backgroundColor: '#fff', elevation: 2, marginRight: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E5631' },

  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },

  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30 },
  tag: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25, borderWidth: 1, borderColor: '#ccc', marginRight: 10, marginBottom: 10, backgroundColor: '#fff' },
  selectedTag: { backgroundColor: '#1E5631', borderColor: '#1E5631' },
  tagText: { color: '#666', fontSize: 14 },
  selectedTagText: { color: '#fff', fontWeight: 'bold' },

  inputBox: { backgroundColor: '#fff', borderRadius: 15, padding: 15, height: 120, marginBottom: 30, elevation: 1 },
  input: { fontSize: 16, color: '#333', height: '100%', textAlignVertical: 'top' },

  submitBtn: { backgroundColor: '#1E5631', padding: 18, borderRadius: 15, alignItems: 'center', elevation: 5, shadowColor: '#1E5631', shadowOpacity: 0.3, shadowRadius: 8 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  /* MODAL STYLES */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#fff', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10 },
  checkCircle: { width: 80, height: 80, backgroundColor: '#4CAF50', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 5 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  modalText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  modalBtn: { backgroundColor: '#1E5631', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});