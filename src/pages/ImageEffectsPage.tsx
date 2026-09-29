import React from 'react';
import { ImageEffectsSection } from '../components/common/ImageEffectsSection';

interface Props {
  onNavigate: (path: string) => void;
}

export const ImageEffectsPage: React.FC<Props> = ({ onNavigate }) => (
  <ImageEffectsSection onBack={() => onNavigate('/')} />
);
