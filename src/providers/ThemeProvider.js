'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/lib/store';

export default function ThemeProvider({ children }) {
  useEffect(() => {
    initializeTheme();
  }, []);

  return <>{children}</>;
}