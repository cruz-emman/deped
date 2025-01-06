import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { auth } from "@/auth";
import { Providers } from "./rootprovider/RootProvider";


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