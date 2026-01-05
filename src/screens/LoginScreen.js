import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      Alert.alert('Login failed', error.message)
    }
    // Navigation will happen automatically via auth state change
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight: 10}} />
          <TextInput placeholder="Email Address" style={styles.input} autoCapitalize="none" value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
          <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 20 }}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6', padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 20 },
  content: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1E5631', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20, elevation: 2 },
  input: { flex: 1, color: '#333' },
  loginBtn: { backgroundColor: '#1E5631', padding: 18, borderRadius: 15, alignItems: 'center', elevation: 5, marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signupText: {
    color: '#1E5631',
    textAlign: 'center',
    fontSize: 14
  }
});