import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { authApi } from '../utils/api';
import { saveToken, saveUser } from '../utils/storage';
import { getFirstName } from '../constants/data';

export default function LoginScreen({ setPage, onAuthSuccess, showToast }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const e = validate();
    setErrors(e);
  };

  const handleSubmit = async () => {
    setTouched({ email: true, password: true });
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const result = await authApi.login({ email: form.email, password: form.password });
      await saveUser(result.user);
      await saveToken(result.token);
      await onAuthSuccess?.({ user: result.user, token: result.token });
      setPage('home');
      showToast(`Welcome back, ${getFirstName(result.user.name)}!`, 'success');
    } catch (error) {
      showToast(error.message || 'Could not sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (field) => [
    styles.input,
    touched[field] && (errors[field] ? styles.inputError : styles.inputValid),
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>SPORTS2YOU</Text>
          <Text style={styles.subtitle}>Sign in to your UTD student account</Text>

          <View style={styles.card}>
            <Text style={styles.label}>UTD Email</Text>
            <TextInput
              style={fieldStyle('email')}
              placeholder="netid@utdallas.edu"
              placeholderTextColor={COLORS.text3}
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              onBlur={() => handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>✕ {errors.email}</Text>
            )}

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <TextInput
              style={fieldStyle('password')}
              placeholder="••••••••"
              placeholderTextColor={COLORS.text3}
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
              onBlur={() => handleBlur('password')}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>✕ {errors.password}</Text>
            )}

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>New to Sports2You?</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.btnGhost} onPress={() => setPage('signup')}>
              <Text style={styles.btnGhostText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.demo}>Use your UTD email and backend account password.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 28, paddingTop: 60, alignItems: 'center' },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.orange,
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.text2, marginBottom: 40 },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.lg,
    padding: 28,
  },
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
    marginTop: 28,
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
  demo: { marginTop: 24, fontSize: FONT_SIZE.xs, color: COLORS.text3 },
});
