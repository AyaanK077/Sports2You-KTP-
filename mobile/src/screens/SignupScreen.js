import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { saveUser } from '../utils/storage';
import { getFirstName, genId } from '../constants/data';

export default function SignupScreen({ setPage, setCurrentUser, onLogin, showToast }) {
  const [form, setForm] = useState({ name: '', email: '', studentId: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async () => {
    const allTouched = { name: true, email: true, studentId: true, password: true, confirm: true };
    setTouched(allTouched);
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const newUser = {
      id: genId(),
      name: form.name.trim(),
      email: form.email,
      studentId: form.studentId,
      phone: '',
      joinedDate: new Date().toISOString().split('T')[0],
      preferredSport: 'basketball',
      favoriteLocations: ['ac'],
    };
    await saveUser(newUser);
    setCurrentUser(newUser);
    onLogin();
    setPage('home');
    showToast(`Welcome, ${getFirstName(newUser.name)}!`, 'success');
  };

  const fieldStyle = (field) => [
    styles.input,
    touched[field] && (errors[field] ? styles.inputError : styles.inputValid),
  ];

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'default' },
    { key: 'email', label: 'UTD Email', placeholder: 'netid@utdallas.edu', type: 'email-address' },
    { key: 'studentId', label: 'Student ID (optional)', placeholder: '2021XXXXXXX', type: 'default' },
    { key: 'password', label: 'Password', placeholder: '••••••••', secure: true },
    { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••', secure: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>SPORTS2YOU</Text>
          <Text style={styles.subtitle}>Create your UTD student account</Text>

          <View style={styles.card}>
            {fields.map((f) => (
              <View key={f.key} style={styles.fieldGroup}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={fieldStyle(f.key)}
                  placeholder={f.placeholder}
                  placeholderTextColor={COLORS.text3}
                  value={form[f.key]}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                  onBlur={() => handleBlur(f.key)}
                  keyboardType={f.type || 'default'}
                  autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                  secureTextEntry={!!f.secure}
                />
                {touched[f.key] && errors[f.key] && (
                  <Text style={styles.errorText}>✕ {errors[f.key]}</Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Already have an account?</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.btnGhost} onPress={() => setPage('login')}>
              <Text style={styles.btnGhostText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 28, paddingTop: 60, alignItems: 'center' },
  logo: { fontSize: 36, fontWeight: '900', color: COLORS.orange, letterSpacing: 2, marginBottom: 10 },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.text2, marginBottom: 40 },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.lg,
    padding: 28,
  },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.red },
  inputValid: { borderColor: COLORS.green },
  errorText: { color: COLORS.red, fontSize: FONT_SIZE.xs, marginTop: 6, fontWeight: '600' },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: FONT_SIZE.xs, color: COLORS.text3 },
  btnGhost: {
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(57,217,138,0.06)',
  },
  btnGhostText: { color: COLORS.text2, fontSize: FONT_SIZE.md, fontWeight: '700' },
});
