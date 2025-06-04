"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import AuthProvider from "@/providers/AuthProvider";
import ProfileRedirectHandler from "@/components/ProfileRedirectHandler";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const hideHeader =
    pathname === "/complete-profile" || user?.status === "pending";
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileRedirectHandler>
            <div className="relative flex min-h-screen flex-col bg-background">
              {!hideHeader && <Header />}
              <main className="flex-1">{children}</main>
            </div>
          </ProfileRedirectHandler>
        </AuthProvider>
      </body>
    </html>
  );
}
