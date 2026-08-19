import React, { useEffect, useState } from 'react';
import { AuthLoadingScreen } from '../auth/AuthLoadingScreen';

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const AuthCallbackPage: React.FC<Props> = ({ onSuccess, onError }) => {
  useEffect(() => {
    // Simulate resolving OAuth SSO callback state
    const timer = setTimeout(() => {
      onSuccess();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onSuccess, onError]);

  return <AuthLoadingScreen />;
};
