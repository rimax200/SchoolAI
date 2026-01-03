import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zyra",
  description: "Coded Chat AI Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="text-[calc(0.7rem+0.35vw)] max-[2300px]:text-[calc(0.7rem+0.32vw)] max-[2150px]:text-[calc(0.7rem+0.28vw)] max-4xl:text-[1rem]"
      lang="en"
    >
      <body
        className={`${inter.variable} ${manrope.variable} bg-gray-25 text-body-md text-gray-800 antialiased max-md:bg-gray-0 font-manrope`}
        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
