import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeepSeek Chat Clone",
  description: "A clone of the DeepSeek Chat interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
