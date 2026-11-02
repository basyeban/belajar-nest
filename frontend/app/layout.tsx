import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CelenganKu - Aplikasi Celengan & Tabungan Impian',
  description:
    'Aplikasi manajemen tabungan pribadi berbasis web untuk memantau impian finansial secara real-time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif]">{children}</body>
    </html>
  );
}

