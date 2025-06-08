// components/settings/ThemeSettings.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Moon, Monitor, Check } from "lucide-react";

interface ThemeSettingsProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function ThemeSettings({
  currentTheme,
  onThemeChange,
}: ThemeSettingsProps) {
  const themeOptions = [
    {
      id: "light",
      name: "라이트",
      icon: Sun,
      bg: "bg-white",
      border: "border-gray-200",
    },
    {
      id: "dark",
      name: "다크",
      icon: Moon,
      bg: "bg-gray-900",
      border: "border-gray-700",
    },
    {
      id: "system",
      name: "시스템",
      icon: Monitor,
      bg: "bg-gradient-to-r from-white to-gray-900",
      border: "border-gray-300",
    },
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-purple-600" />
          </div>
          테마 설정
        </CardTitle>
        <CardDescription>원하는 테마를 선택하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((theme) => {
            const Icon = theme.icon;
            const isSelected = currentTheme === theme.id;

            return (
              <div
                key={theme.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onThemeChange(theme.id)}
              >
                <div
                  className={`flex items-center justify-center h-16 rounded-lg mb-3 ${theme.bg} ${theme.border} border`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      theme.id === "dark" ? "text-white" : "text-gray-700"
                    }`}
                  />
                </div>
                <p className="text-center font-medium text-gray-900">
                  {theme.name}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
