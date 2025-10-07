import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";
import Navbar from "@/components/home/Navbar";
import ThemeProvider from "@/providers/ThemeProvider";
import ToasterProvider from "@/providers/ToastProvider";

export const metadata = {
  title: "Dimen Shop",
  description: "Get your desired 3D printed products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       <ThemeProvider>
         <AuthProvider>
          <Navbar />
          {children}
          <ToasterProvider />
        </AuthProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}
