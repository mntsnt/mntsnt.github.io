import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Mintesnot Leliso — Medicine × Design × Technology',
  description:
    'Mintesnot Leliso — medical student, graphic designer, and developer. Medicine × Design × Technology.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://mintesnot-leliso.vercel.app'
  ),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/img/folder.png',
  },
  openGraph: {
    title: 'Mintesnot Leliso — Medicine × Design × Technology',
    description:
      'Mintesnot Leliso — medical student, graphic designer, and developer. Medicine × Design × Technology.',
    url: 'https://mintesnot-leliso.vercel.app',
    siteName: 'Mintesnot Leliso Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/img/cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Mintesnot Leliso — Medicine × Design × Technology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mintesnot Leliso — Medicine × Design × Technology',
    description:
      'Mintesnot Leliso — medical student, graphic designer, and developer. Medicine × Design × Technology.',
    images: ['/img/cover.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mintesnot Leliso',
    jobTitle: ['Medical Student', 'Graphic Designer', 'Developer'],
    description:
      'Medical student at St. Paul’s Hospital Millennium Medical College exploring graphic design and software development.',
    url: 'https://mintesnot-leliso.vercel.app',
    image: 'https://mintesnot-leliso.vercel.app/img/profile-img.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Addis Ababa',
      addressCountry: 'Ethiopia',
    },
    sameAs: [
      'https://github.com/Mntsnt',
      'https://www.linkedin.com/in/mintesnotleliso',
      'https://t.me/bale_helm',
      'https://www.upwork.com/freelancers/~011e3d5613a4e88ee3?mp_source=share',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash theme inline script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('portfolio-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(d?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
