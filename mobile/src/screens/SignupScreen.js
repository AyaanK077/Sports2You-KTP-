import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { authApi } from '../utils/api';
import { saveToken, saveUser } from '../utils/storage';
import { getFirstName } from '../constants/data';

export default function SignupScreen({ setPage, onAuthSuccess, showToast }) {
  const [form, setForm] = useState({ name: '', email: '', studentId: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const studentIdRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

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

  const handleChange = (field, value) => {
    setForm((p) => {
      const next = { ...p, [field]: value };
      if (touched[field]) {
        const e = {};
        if (!next.name.trim()) e.name = 'Name is required';
        if (!next.email.includes('@')) e.email = 'Enter a valid email';
        if (next.password.length < 6) e.password = 'Password must be at least 6 characters';
        if (next.password !== next.confirm) e.confirm = 'Passwords do not match';
        setErrors(e);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    const allTouched = { name: true, email: true, studentId: true, password: true, confirm: true };
    setTouched(allTouched);
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const result = await authApi.signup({
        name: form.name.trim(),
        email: form.email,
        studentId: form.studentId,
        password: form.password,
      });
      await saveUser(result.user);
      await saveToken(result.token);
      await onAuthSuccess?.({ user: result.user, token: result.token });
      setPage('home');
      showToast(`Welcome, ${getFirstName(result.user.name)}!`, 'success');
    } catch (error) {
      showToast(error.message || 'Could not create your account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => [
    styles.input,
    touched[field] && errors[field] ? styles.inputError : null,
    touched[field] && !errors[field] && form[field] ? styles.inputValid : null,
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logo}>SPORTS2YOU</Text>
          <Text style={styles.subtitle}>Create your UTD student account</Text>

          <View style={styles.card}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={inputStyle('name')}
                placeholder="Jane Smith"
                placeholderTextColor={COLORS.text3}
                value={form.name}
                onChangeText={(v) => handleChange('name', v)}
                onBlur={() => handleBlur('name')}
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
              {touched.name && errors.name && <Text style={styles.errorText}>✕ {errors.name}</Text>}
            </View>

            {/* UTD Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>UTD Email</Text>
              <TextInput
                ref={emailRef}
                style={inputStyle('email')}
                placeholder="you@utdallas.edu"
                placeholderTextColor={COLORS.text3}
                value={form.email}
                onChangeText={(v) => handleChange('email', v)}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => studentIdRef.current?.focus()}
                blurOnSubmit={false}
              />
              {touched.email && errors.email && <Text style={styles.errorText}>✕ {errors.email}</Text>}
            </View>

            {/* Student ID */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Student ID (optional)</Text>
              <TextInput
                ref={studentIdRef}
                style={inputStyle('studentId')}
                placeholder="2021XXXXXXX"
                placeholderTextColor={COLORS.text3}
                value={form.studentId}
                onChangeText={(v) => handleChange('studentId', v)}
                onBlur={() => handleBlur('studentId')}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                ref={passwordRef}
                style={inputStyle('password')}
                placeholder="Min. 6 characters"
                placeholderTextColor={COLORS.text3}
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                onBlur={() => handleBlur('password')}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                autoComplete="off"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                blurOnSubmit={false}
              />
              {touched.password && errors.password && <Text style={styles.errorText}>✕ {errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                ref={confirmRef}
                style={inputStyle('confirm')}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.text3}
                value={form.confirm}
                onChangeText={(v) => handleChange('confirm', v)}
                onBlur={() => handleBlur('confirm')}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                autoComplete="off"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              {touched.confirm && errors.confirm && <Text style={styles.errorText}>✕ {errors.confirm}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
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

            <TouchableOpacity style={styles.btnGhost} onPress={() => setPage('login')} activeOpacity={0.8}>
              <Text style={styles.btnGhostText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom padding so last field clears keyboard */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 28, paddingTop: 56, alignItems: 'center', flexGrow: 1 },
  logo: { fontSize: 38, fontWeight: '900', color: COLORS.orange, letterSpacing: 2.5, marginBottom: 12 },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.text2, marginBottom: 44, lineHeight: 23 },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.lg,
    padding: 26,
  },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: 10, letterSpacing: -0.1 },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.red },
  inputValid: { borderColor: COLORS.green },
  errorText: { color: COLORS.red, fontSize: FONT_SIZE.xs, marginTop: 8, fontWeight: '600', lineHeight: 17 },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '800', letterSpacing: 0.2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: FONT_SIZE.xs, color: COLORS.text3 },
  btnGhost: {
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(57,217,138,0.06)',
  },
  btnGhostText: { color: COLORS.text2, fontSize: FONT_SIZE.md, fontWeight: '700' },
});
