import { SessionGate } from "@/components/SessionGate";
import type { Metadata } from "next";
import { Noto_Sans_KR } from 'next/font/google';
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: "FE.dev developer sumnie's chatbot",
  description: "챗봇과 대화하며 sumnie의 기술, 프로젝트, 가치관을 탐색해보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansKR.variable} antialiased`}
      >
        <SessionGate>{children}</SessionGate>
      </body>
    </html>
  );
}
