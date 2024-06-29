import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const defaultFont = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Pharmacy Connect',
  description: 'This is a version of the Connecting Wall or Connections specific to a pharmacy trivia competition.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={defaultFont.className}>
        {children}
      </body>
    </html>
  );
}
