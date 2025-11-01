import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'MGNREGA Dashboard' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="MGNREGA district-level KPIs for rural citizens" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="gov-header">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">MGNREGA Dashboard</h1>
                <p className="text-blue-100 text-sm mt-1">
                  महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
        <footer className="bg-gray-800 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© 2024 MGNREGA Dashboard. Data sourced from data.gov.in</p>
          </div>
        </footer>
      </div>
    </>
  );
}

