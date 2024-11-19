// noinspection SpellCheckingInspection

import type { Metadata } from "next";
import "./globals.css";
import { Alegreya } from "next/font/google";
import React from "react";

const alegreya = Alegreya({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dnd Character Sheet",
  description: "A character sheet for DnD 5e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${alegreya.className} antialiased bg-background text-text`}>
        {children}
      </body>
    </html>
  );
}
