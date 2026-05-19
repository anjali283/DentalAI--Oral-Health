import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import BackgroundEffect from "./components/BackgroundEffect";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BackgroundEffect/>
        <Navbar />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
 
