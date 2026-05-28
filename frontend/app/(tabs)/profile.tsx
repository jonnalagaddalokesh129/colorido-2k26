import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Typography } from '../../constants/typography';
import { User, LogOut, ChevronRight, Phone, Heart, Info, History } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, refreshProfile } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      blood_group: user?.blood_group || '',
      allergies: user?.allergies || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        blood_group: user.blood_group || '',
        allergies: user.allergies || '',
      });
    }
  }, [user]);

  const onSave = async (data: ProfileFormValues) => {
    setSaving(true);
    try {
      await authService.updateProfile(data);
      await refreshProfile();
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Profile update failed';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to sign out of RoadSOS?');
      if (confirmLogout) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of RoadSOS?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
    }
  };

  const quickLinks = [
    { title: 'Emergency Contacts', icon: <Phone size={18} color={theme.secondary} />, route: '/emergency-contacts' },
    { title: 'SOS History', icon: <History size={18} color={theme.secondary} />, route: '/sos-history' },
    { title: 'About RoadSOS', icon: <Info size={18} color={theme.secondary} />, route: '/about' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: `${theme.secondary}15`, borderColor: theme.secondary }]}>
          <User size={36} color={theme.secondary} />
        </View>
        <Text style={[styles.name, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.email, { color: theme.mutedForeground }]}>
          {user?.email || ''}
        </Text>
        <Badge label="SOS VERIFIED" variant="success" style={styles.badge} />
      </View>

      <View style={styles.padded}>
        {/* Personal Info Section */}
        <Text style={[styles.sectionTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          Personal Information
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="FULL NAME"
              placeholder="your full name"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="PHONE NUMBER"
              placeholder="10 digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.phone?.message}
            />
          )}
        />

        {/* Medical Info */}
        <Text style={[styles.sectionTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          Medical Information
        </Text>

        <Controller
          control={control}
          name="blood_group"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="BLOOD GROUP"
              placeholder="e.g., A+, B-, O+, AB+"
              autoCapitalize="characters"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
            />
          )}
        />

        <Controller
          control={control}
          name="allergies"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="ALLERGIES / CONDITIONS"
              placeholder="e.g., Penicillin, Asthma, Diabetes"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
            />
          )}
        />

        <Button
          title="SAVE PROFILE"
          onPress={handleSubmit(onSave)}
          loading={saving}
          style={styles.saveBtn}
        />

        {/* Quick Links */}
        <Text style={[styles.sectionTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif, marginTop: 28 }]}>
          Quick Access
        </Text>

        {quickLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => router.push(link.route as any)}
          >
            <Card style={styles.linkCard}>
              <View style={styles.linkLeft}>
                <View style={[styles.linkIcon, { backgroundColor: `${theme.border}50` }]}>
                  {link.icon}
                </View>
                <Text style={[styles.linkTitle, { color: theme.primary }]}>{link.title}</Text>
              </View>
              <ChevronRight size={18} color={theme.mutedForeground} />
            </Card>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <Button
          title="SIGN OUT OF ROADSOS"
          variant="destructive"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </View>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  name: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '900',
    marginBottom: 4,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    marginBottom: 10,
  },
  badge: {
    marginTop: 4,
  },
  padded: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 16,
    marginTop: 12,
  },
  saveBtn: {
    marginTop: 8,
    marginBottom: 12,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 10,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  logoutBtn: {
    marginTop: 28,
    marginBottom: 16,
  },
  bottomSpace: {
    height: 40,
  },
});
