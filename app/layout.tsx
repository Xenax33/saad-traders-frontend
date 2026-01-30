import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/components/providers/query-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Toaster } from 'react-hot-toast';
import DevToolsProtection from "@/components/DevToolsProtection";
import GlobalLoader from "@/components/GlobalLoader";
import LayoutContent from "@/components/layouts/LayoutContent";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saadtraders.com'),
  title: {
    default: "FBR-Compliant Digital Invoicing in Pakistan | Saad Traders",
    template: "%s | Saad Traders"
  },
  description: "FBR-compliant digital invoicing platform for Pakistani businesses. Create, manage, and validate invoices that meet Federal Board of Revenue (FBR) requirements. Premium textile supplies available as a secondary service.",
  keywords: [
    "FBR invoice Pakistan",
    "FBR compliant invoicing",
    "FBR digital invoice",
    "Pakistan e-invoicing",
    "FBR sales tax invoice",
    "FBR POS integration",
    "create FBR invoice",
    "digital invoice Pakistan",
    "Saad Traders",
    "textile supplies",
    "stitching thread Pakistan",
    "dyeing materials"
  ],
  authors: [{ name: "Saad Traders" }],
  creator: "Saad Traders",
  publisher: "Saad Traders",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://saadtraders.com/',
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://saadtraders.com",
    siteName: "Saad Traders",
    title: "FBR-Compliant Digital Invoicing in Pakistan | Saad Traders",
    description: "Create and validate FBR-compliant digital invoices for Pakistani businesses.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Saad Traders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBR-Compliant Digital Invoicing in Pakistan | Saad Traders",
    description: "Create and validate FBR-compliant digital invoices.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://saadtraders.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#047857" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/svg+xml" href="/logos/company-logo.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        
        {/* PWA Icons */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Saad Traders",
              "url": "https://saadtraders.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://saadtraders.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "FBR-Compliant Digital Invoicing",
              "provider": {
                "@type": "Organization",
                "name": "Saad Traders",
                "url": "https://saadtraders.com/"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Pakistan"
              },
              "serviceType": "Digital invoicing compliant with Federal Board of Revenue (FBR)",
              "url": "https://saadtraders.com/digital-invoice"
            }),
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <LoadingProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#047857',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <GlobalLoader />
              <DevToolsProtection />
              <LayoutContent>{children}</LayoutContent>
            </LoadingProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
