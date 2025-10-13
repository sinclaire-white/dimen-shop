// components/layout/LayoutWrapper.jsx
'use client';

import { usePathname } from 'next/navigation';
import ConditionalLayout from './ConditionalLayout';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if current route is dashboard-related
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <ConditionalLayout isDashboard={isDashboard}>
      {children}
    </ConditionalLayout>
  );
}