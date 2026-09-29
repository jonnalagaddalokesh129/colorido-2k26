import React from 'react';
import { LoginPage } from './LoginPage';

interface Props {
  onNavigate: (path: string) => void;
}

export const RegisterAuthPage: React.FC<Props> = ({ onNavigate }) => {
  return <LoginPage onNavigate={onNavigate} initialMode="register" />;
};
