import type { Metadata } from "next";
import { Noto_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Noto_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WikiIndex",
  description: "A research demo to visualize how retrieval augmented generation (RAG) applications answer questions. Made by Nick Bukovec for Cal Poly senior project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${serif.variable} ${inter.variable}`}>
        <body className={`font-sans`}> {children}</body>
      </html>
    </ViewTransitions>
  );
}
