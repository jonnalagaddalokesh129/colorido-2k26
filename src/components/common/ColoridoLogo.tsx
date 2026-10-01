import React from 'react';
import userPromptedLogo from '../../assets/logo.png';

interface Props {
  variant?: 'full' | 'inline' | 'icon-only' | 'image';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ColoridoLogo: React.FC<Props> = ({
  size = 'md',
  className = '',
}) => {
  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 'clamp(32px, 3.8vw, 40px)';
      case 'lg':
        return 'clamp(56px, 6.5vw, 76px)';
      case 'xl':
        return 'clamp(68px, 8vw, 96px)';
      case 'md':
      default:
        return 'clamp(38px, 4.2vw, 46px)';
    }
  };

  return (
    <div className={`flex items-center cursor-pointer select-none ${className}`}>
      <img
        src={userPromptedLogo}
        alt="COLORIDO 2K26 - National Level Cultural & Sports Festival"
        style={{
          height: getHeight(),
          width: 'auto',
          maxWidth: size === 'sm' ? 'clamp(110px, 30vw, 175px)' : 'clamp(140px, 18vw, 220px)',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 0 12px rgba(255, 20, 147, 0.45)) drop-shadow(0 0 24px rgba(91, 33, 245, 0.35))'
        }}
      />
    </div>
  );
};
