// components/layout/ConditionalLayout.jsx
'use client';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function ConditionalLayout({ children, isDashboard = false }) {
  return (
    <>
      {/* Only show navbar if not in dashboard */}
      {!isDashboard && <Navbar />}
      
      {/* Main content */}
      {children}
      
      {/* Only show footer if not in dashboard */}
      {!isDashboard && <Footer />}
    </>
  );
}