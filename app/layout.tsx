import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Providers } from "./rootprovider/RootProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Deped MALABON",
  description: "DEPED MALABON",
};

export default async function RootLayout({ children }: { children: any }) {
  const session = await auth();
  return (
    <html>
      <head>
        <link rel="shortcut icon" 
          sizes="<generated>"
          type="image/<generated>"
          href="/images/logo.png" />
      </head>
      <body className="overflow-x-clip h-auto">
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}