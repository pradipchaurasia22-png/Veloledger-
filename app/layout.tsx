import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VeloLedger',
  description: 'Enterprise Escrow & Cash Velocity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
