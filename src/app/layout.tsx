import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import DynamicQR from "@/components/DynamicQR";

const defaultFont = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'OncRx Connect',
  description: 'This is a version of the Connecting Wall or Connections specific to a pharmacy trivia competition.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`${process.env.BASE_PATH}/favicon.png?v=2`} />
      </head>
      <body className={defaultFont.className}>
        {children}
        <footer>
          <DynamicQR />
        </footer>
      </body>
    </html>
  );
}
