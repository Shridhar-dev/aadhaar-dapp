"use client"
import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import "./globals.css";
import { AnonAadhaarProvider } from '@anon-aadhaar/react'

const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({ subsets: ["latin"], weight:"400", variable: '--font-pacifico', });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pacifico.variable} ${inter.className}`}>
        <AnonAadhaarProvider _fetchArtifactsFromServer={false} _useTestAadhaar={true} >
          {children}
        </AnonAadhaarProvider>
      </body>
    </html>
  );
}
