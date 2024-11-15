import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Woolf and Fox Connection",
  description: "App to manage fiber optic orders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <StoreProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
        >
          <Header />
          <main className="flex-grow px-4 sm:px-6 lg:px-8 bg-background  shadow-md ">
            {children}
          </main>
          <Footer />
        </body>
      </StoreProvider>
    </html>
  );
}
