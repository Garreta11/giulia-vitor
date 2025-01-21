import './globals.scss';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import PageWrapper from './components/PageWrapper/PageWrapper';

export const metadata = {
  title: 'Giulia & Vitor',
  description: "Invite to Giulia and Vitor's wedding in Brazil",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang='en'>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PageWrapper>{children}</PageWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
