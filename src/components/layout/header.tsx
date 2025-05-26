"use client";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import LoginModal from "../auth/login-register-modal";
import { useState } from "react";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto grid grid-cols-2 h-16 items-center px-4">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">D</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                dev_kundalik
              </span>
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center justify-end space-x-4">
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[11px] font-medium text-white flex items-center justify-center">
                3
              </span>
              <span className="sr-only">알림</span>
            </Button>

            {/* Login Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsLoginModalOpen(true)}
            >
              로그인
            </Button>
          </div>
        </div>
      </header>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
