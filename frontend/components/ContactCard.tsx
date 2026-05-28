import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { EmergencyContact } from '../types';
import { Phone, Trash2, Edit } from 'lucide-react-native';

interface ContactCardProps {
  contact: EmergencyContact;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.primary }]}>{contact.name}</Text>
        <Text style={[styles.relation, { color: theme.secondary }]}>
          {contact.relationship.toUpperCase()}
        </Text>
        <View style={styles.phoneContainer}>
          <Phone size={14} color={theme.mutedForeground} style={styles.icon} />
          <Text style={[styles.phone, { color: theme.mutedForeground }]}>{contact.phone}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity activeOpacity={0.7} onPress={onEdit} style={[styles.btn, { borderColor: theme.border }]}>
            <Edit size={16} color={theme.mutedForeground} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity activeOpacity={0.7} onPress={onDelete} style={[styles.btn, { borderColor: theme.border }]}>
            <Trash2 size={16} color={theme.destructive} />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  relation: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  phone: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
