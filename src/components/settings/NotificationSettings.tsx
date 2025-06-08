// components/settings/NotificationSettings.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell } from "lucide-react";

interface NotificationSettingsProps {
  email: string;
  emailVerified: boolean;
  settings: {
    commentNotifications: boolean;
    blogUpdates: boolean;
  };
  onSettingsChange: (newSettings: {
    commentNotifications?: boolean;
    blogUpdates?: boolean;
  }) => void;
}

export default function NotificationSettings({
  email,
  emailVerified,
  settings,
  onSettingsChange,
}: NotificationSettingsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-green-600" />
          </div>
          이메일 설정
        </CardTitle>
        <CardDescription>이메일 주소 및 알림 설정을 관리하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">{email}</p>
            <p className="text-sm text-gray-500">기본 이메일 주소</p>
          </div>
          <Badge variant={emailVerified ? "default" : "secondary"}>
            {emailVerified ? "인증됨" : "미인증"}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림 설정
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="comment-notifications" className="font-medium">
                  댓글 알림
                </Label>
                <p className="text-sm text-gray-500">
                  새 댓글이 달릴 때 이메일로 알림을 받습니다
                </p>
              </div>
              <Switch
                id="comment-notifications"
                checked={settings.commentNotifications}
                onCheckedChange={(checked) =>
                  onSettingsChange({ commentNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="blog-updates" className="font-medium">
                  블로그 업데이트
                </Label>
                <p className="text-sm text-gray-500">
                  새로운 기능 및 업데이트 소식을 받습니다
                </p>
              </div>
              <Switch
                id="blog-updates"
                checked={settings.blogUpdates}
                onCheckedChange={(checked) =>
                  onSettingsChange({ blogUpdates: checked })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
