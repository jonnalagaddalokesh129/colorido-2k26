import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, Alert, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { contactService } from '../services/contactService';
import { EmergencyContact } from '../types';
import { Header } from '../components/ui/Header';
import { ContactCard } from '../components/ContactCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Typography } from '../constants/typography';
import { contactSchema } from '../utils/validation';
import { Phone, Plus, X, User } from 'lucide-react-native';

export default function EmergencyContactsScreen() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  
  // Validation Errors State
  const [errors, setErrors] = useState<{ name?: string; phone?: string; relationship?: string }>({});

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await contactService.getContacts();
      setContacts(data);
    } catch (e) {
      console.log('Error fetching contacts', e);
      showToast('Unable to retrieve emergency contacts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setRelationship('');
    setErrors({});
    setModalVisible(true);
  };

  const openEditModal = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setErrors({});
    setModalVisible(true);
  };

  const validateForm = () => {
    const result = contactSchema.safeParse({ name, phone, relationship });
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
        if (err.path[0] === 'phone') fieldErrors.phone = err.message;
        if (err.path[0] === 'relationship') fieldErrors.relationship = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      if (editingId) {
        // Edit contact
        const updated = await contactService.updateContact(editingId, name, phone, relationship);
        setContacts(prev => prev.map(c => c.id === editingId ? updated : c));
        showToast('Contact updated successfully', 'success');
      } else {
        // Create contact
        const created = await contactService.createContact(name, phone, relationship);
        setContacts(prev => [...prev, created]);
        showToast('Contact added successfully', 'success');
      }
      setModalVisible(false);
    } catch (err: any) {
      console.log('Error saving contact', err);
      const msg = err.response?.data?.detail || 'Unable to save emergency contact.';
      showToast(msg, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteContactAction = async (id: string) => {
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      showToast('Contact removed successfully', 'success');
    } catch (e) {
      console.log('Error deleting contact', e);
      showToast('Failed to delete contact.', 'error');
    }
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Are you sure you want to remove this emergency contact?');
      if (confirmDelete) {
        deleteContactAction(id);
      }
    } else {
      Alert.alert(
        'Remove Contact',
        'Are you sure you want to remove this emergency contact?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => deleteContactAction(id),
          }
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Emergency Contacts" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Configure trusted guardians who will be automatically notified with your live coordinates whenever you trigger an SOS.
        </Text>

        {loading ? (
          <LoadingSpinner message="Retrieving contact list..." />
        ) : contacts.length === 0 ? (
          <EmptyState
            title="No Contacts Configured"
            description="You have not added any emergency contacts. Add one now to ensure your guardians are notified during an SOS emergency."
            icon={<Phone size={36} color={theme.mutedForeground} />}
          />
        ) : (
          contacts.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              onEdit={() => openEditModal(c)}
              onDelete={() => handleDelete(c.id)}
            />
          ))
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title="Add Emergency Contact"
          onPress={openAddModal}
          variant="primary"
          style={styles.addBtn}
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>
                {editingId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                value={name}
                onChangeText={setName}
                error={errors.name}
              />
              <Input
                label="Phone Number"
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
              />
              <Input
                label="Relationship"
                placeholder="e.g. Spouse, Parent, Sibling, Friend"
                value={relationship}
                onChangeText={setRelationship}
                error={errors.relationship}
              />

              <Button
                title={editingId ? 'Update Contact' : 'Save Contact'}
                onPress={handleSubmit}
                loading={submitLoading}
                variant="primary"
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    marginBottom: 20,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    backgroundColor: '#0C0A09', // Safe dark backdrop
  },
  addBtn: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  modalForm: {
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
