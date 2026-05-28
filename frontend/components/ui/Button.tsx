import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '../../constants/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getStyles = () => {
    let bgStyle: ViewStyle = {};
    let textCol: string = theme.primary;

    switch (variant) {
      case 'primary':
        bgStyle = { backgroundColor: theme.secondary };
        textCol = theme.secondaryForeground;
        break;
      case 'secondary':
        bgStyle = { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border };
        textCol = theme.primary;
        break;
      case 'outline':
        bgStyle = { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.secondary };
        textCol = theme.secondary;
        break;
      case 'destructive':
        bgStyle = { backgroundColor: theme.destructive };
        textCol = theme.primary;
        break;
    }

    if (disabled) {
      bgStyle = { ...bgStyle, opacity: 0.4 };
    }

    return { bgStyle, textCol };
  };

  const { bgStyle, textCol } = getStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[styles.btn, bgStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={textCol} size="small" />
      ) : (
        <Text style={[styles.text, { color: textCol }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
});
