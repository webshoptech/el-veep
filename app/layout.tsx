import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import SplashScreen from "./components/SplashScreen";
import TopHeader from "./components/TopHeader";
import NavBar from "./components/NavBar";
import Providers from "./providers";
import Footer from "./components/Footer";
import { CartProvider } from "@/context/CartContext";
// import GoogleOneTap from "@/lib/providers";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-roboto",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"], 
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Afrovending Online Market",
  manifest: "/site.webmanifest", 
  
  description:
    "Buy authentic African groceries, clothes, and the best African foods online. Afrovending brings you fresh ingredients, fashion, and essentials from Africa — all in one trusted online marketplace.",
  keywords: [
    "African groceries",
    "African clothes",
    "African foods",
    "online African market",
    "buy African products",
    "African fashion",
    "African marketplace",
    "Afrovending",
  ],
  openGraph: {
    title: "Afrovending Online Market | African Groceries, Clothes & Foods",
    description:
      "Buy authentic African groceries, clothes, and foods online. Afrovending delivers Africa’s best — fresh ingredients, fashion & essentials — right to your door.",
    url: "https://afrovending.com",
    siteName: "Afrovending",
    images: [
      {
        url: "https://afrovending.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Afrovending - African Online Market",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afrovending Online Market | African Groceries, Clothes & Foods",
    description:
      "Shop authentic African groceries, clothes & foods online. Afrovending delivers Africa’s best directly to your home.",
    images: ["https://afrovending.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${montserrat.variable} font-sans antialiased bg-white`}
      >
        <Providers>
          <CartProvider>
            <TopHeader />
            <NavBar />
            {children}
            <SplashScreen />
            <Footer />
          </CartProvider>
          {/* <GoogleOneTap /> */}
        </Providers>

        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />

        <Toaster />
      </body>
    </html>
  );
}
