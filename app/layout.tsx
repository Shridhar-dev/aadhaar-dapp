"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnonAadhaarProvider } from '@anon-aadhaar/react'

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnonAadhaarProvider _fetchArtifactsFromServer={false} _useTestAadhaar={true} >
          {children}
        </AnonAadhaarProvider>
      </body>
    </html>
  );
}
