import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";
import Navbar from "@/components/home/Navbar";

export const metadata = {
  title: "Dimen Shop",
  description: "Get your desired 3D printed products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
