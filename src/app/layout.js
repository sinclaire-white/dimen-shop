import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import ToasterProvider from "@/providers/ToastProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata = {
  title: 'DimenShop - Premium 3D Printed Products',
  description: 'Discover high-quality 3D printed products for your home, office, and creative projects. Custom designs and premium materials.',
  icons: {
    icon: '/dimen_shp_logo.png',
    apple: '/dimen_shp_logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       <ThemeProvider>
         <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <ToasterProvider />
        </AuthProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}
