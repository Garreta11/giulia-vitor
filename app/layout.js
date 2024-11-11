import './globals.scss';
import PageWrapper from './components/PageWrapper/PageWrapper';

export const metadata = {
  title: 'Giulia & Vitor',
  description: "Website to celebrate Giulia and Vitor's wedding",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
