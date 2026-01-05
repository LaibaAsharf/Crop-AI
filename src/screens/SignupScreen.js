import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Show success message with email verification notice
      Alert.alert(
        'Account Created!', 
        'Please check your email to verify your account before logging in.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login')
          }
        ]
      )
    } catch (error) {
      Alert.alert('Signup failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight: 10}} />
          <TextInput 
            placeholder="Email Address" 
            style={styles.input} 
            autoCapitalize="none"
            keyboardType="email-address"
            value={email} 
            onChangeText={setEmail} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
          <TextInput 
            placeholder="Password (min 6 characters)" 
            secureTextEntry 
            style={styles.input}
            value={password}
            onChangeText={setPassword} 
          />
        </View>

        <TouchableOpacity 
          onPress={handleSignup} 
          style={styles.signupBtn} 
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          You can set your name and profile picture after logging in
        </Text>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')} 
          style={{ marginTop: 20 }}
        >
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF9E6', 
    padding: 20 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#1E5631', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 40 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 15, 
    elevation: 2 
  },
  input: { 
    flex: 1, 
    color: '#333' 
  },
  signupBtn: { 
    backgroundColor: '#1E5631', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 5, 
    marginTop: 10 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  noteText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 15,
    fontStyle: 'italic'
  },
  loginText: {
    color: '#1E5631',
    textAlign: 'center',
    fontSize: 14
  }
})