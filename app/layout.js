import './globals.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageWrapper from './components/PageWrapper/PageWrapper';

export const metadata = {
  title: 'Giulia & Vitor',
  description: "Website to celebrate Giulia and Vitor's wedding",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
      </body>
    </html>
  );
}
