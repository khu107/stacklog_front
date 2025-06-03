// app/layout.tsx (AuthProvider 추가)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import AuthProvider from "@/providers/AuthProvider"; // 🆕 추가

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dev_kundalik",
  description: "개발자들의 이야기",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* 🆕 전역 인증 Provider */}
          <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
