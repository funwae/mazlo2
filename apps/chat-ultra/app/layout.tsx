import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat Ultra with Mazlo',
  description: 'A project-centric AI workspace for heavy users who live in chat all day.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

