import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Date Tower | Chocolala',
  description: 'Discover a Chocolala signature creation, assembled piece by exquisite piece.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
