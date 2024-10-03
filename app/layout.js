import localFont from 'next/font/local';
import './globals.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageWrapper from './components/PageWrapper/PageWrapper';
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Giulia & Vitor',
  description: "Website to celebrate Giulia and Vitor's wedding",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
      </body>
    </html>
  );
}
