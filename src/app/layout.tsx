import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { brandName } from '../data/brand';
import '@fontsource-variable/inter';
import './globals.css';
import '../components/cinematic-hero.css';

export const metadata: Metadata = {
  title: `${brandName} | Da grelha para a tua mesa`,
  description: `Conhece o menu da ${brandName}. Hambúrgueres, batatas, pizzas, frango, bebidas e sobremesas.`,
};

export const viewport: Viewport = { themeColor: '#100e0c' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
