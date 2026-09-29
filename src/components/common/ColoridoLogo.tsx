import React from 'react';
import userPromptedLogo from '../../assets/logo.png';

interface Props {
  variant?: 'full' | 'inline' | 'icon-only' | 'image';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ColoridoLogo: React.FC<Props> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center cursor-pointer select-none ${className}`}>
      <img
        src={userPromptedLogo}
        alt="COLORIDO 2K26 - National Level Cultural & Sports Festival"
        style={{
          height: 'clamp(52px, 7vw, 72px)',
          width: 'auto',
          maxWidth: 'clamp(200px, 28vw, 300px)',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};
