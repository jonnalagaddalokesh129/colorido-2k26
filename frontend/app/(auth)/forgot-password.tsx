import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../constants/typography';
import { ShieldAlert } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Reset instructions sent to your email', 'success');
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.secondary}15`, borderColor: theme.secondary }]}>
          <ShieldAlert size={40} color={theme.secondary} />
        </View>
        <Text style={[styles.title, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          Reset Password
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Enter your registered email address to receive recovery instructions.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="EMAIL ADDRESS"
          placeholder="enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <Button
          title="SEND RECOVERY LINK"
          loading={loading}
          onPress={handleReset}
          style={styles.submitBtn}
        />
        
        <Button
          title="BACK TO LOGIN"
          variant="secondary"
          onPress={() => router.back()}
          style={styles.backBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 12,
  },
  backBtn: {
    marginTop: 4,
  },
});
