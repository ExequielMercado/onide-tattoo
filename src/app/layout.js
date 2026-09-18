import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export const metadata = {
  metadataBase: new URL('https://onidetattoo.com'),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
  },
  title: 'Onide Tattoo | Tattoo Artist in Edmonton, AB',
  description: 'Onide — tattoo artist specializing in Black & Grey, Realism, and Bio-organic tattoos in Edmonton, Alberta.',
  openGraph: {
    title: 'Onide Tattoo | Edmonton, AB',
    description: 'Black & Grey, Realism, and Bio-Organic tattoos in Edmonton, Alberta.',
    url: 'https://onidetattoo.com',
    siteName: 'Onide Tattoo',
    images: ['/images/og-image.jpg'],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onide Tattoo | Edmonton, AB',
    description: 'Black & Grey, Realism, and Bio-Organic tattoos in Edmonton, Alberta.',
    images: ['/images/og-image.jpg'],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-black text-white">
        <Header />
        <main className="min-h-screen bg-black text-white">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}