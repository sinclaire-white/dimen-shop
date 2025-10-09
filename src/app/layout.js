import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import ThemeProvider from "@/providers/ThemeProvider";
import ToasterProvider from "@/providers/ToastProvider";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: 'DimenShop - Premium 3D Models Marketplace',
  description: 'Discover high-quality 3D models for games, architecture, animation, and 3D printing. Premium digital assets from trusted creators.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       <ThemeProvider>
         <AuthProvider>
          <Navbar />
          {children}
          {/* <Footer /> */}
          <ToasterProvider />
        </AuthProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}
