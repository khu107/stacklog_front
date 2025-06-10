"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Github,
  Linkedin,
  Globe,
  Edit3,
  Check,
  X,
  Trash2,
  Loader2,
} from "lucide-react";

import ThemeSettings from "@/components/settings/ThemeSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DangerZone from "@/components/settings/DangerZone";
import { useAuthStore } from "@/stores/auth-store";

import { useCurrentUser } from "@/hooks/useUsers";
import {
  useUpdateBasicProfile,
  useUpdateSocialProfile,
  useUpdateIdname,
  useUploadAvatar,
  useDeleteAvatar,
  useCheckIdname,
} from "@/hooks/useUsers";

import { getAvatarFallback, getAvatarUrl } from "@/lib/utils";
import type { UserProfile } from "@/lib/api/users";

export default function SettingsPage() {
  const { hasHydrated } = useAuthStore();

  // React Query 훅들 사용
  const {
    data: user,
    isLoading: loading,
    error,
    refetch: loadProfile,
  } = useCurrentUser();

  const updateBasicMutation = useUpdateBasicProfile();
  const updateSocialMutation = useUpdateSocialProfile();
  const updateIdnameMutation = useUpdateIdname();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  // 설정 상태
  const [settings, setSettings] = useState({
    emailNotifications: true,
    blogUpdates: false,
    commentNotifications: true,
    theme: "light",
  });

  // 편집 상태
  const [isEditing, setIsEditing] = useState({
    basic: false,
    social: false,
    idname: false,
  });

  // 임시 데이터
  const [tempData, setTempData] = useState<Partial<UserProfile>>({});
  const [idnameInput, setIdnameInput] = useState("");

  // ID명 중복 확인 (실시간)
  const { data: idnameCheck } = useCheckIdname(idnameInput);

  // user 데이터가 변경될 때 tempData 업데이트
  useEffect(() => {
    if (user) {
      setTempData(user);
    }
  }, [user]);

  // 편집 모드 토글
  const handleEdit = (section: keyof typeof isEditing) => {
    if (!user) return;

    if (isEditing[section]) {
      setTempData({ ...user });
    } else {
      setTempData({ ...user });
      if (section === "idname") {
        setIdnameInput(user.idname || "");
      }
    }
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // React Query로 저장 처리
  const handleSave = async (section: keyof typeof isEditing) => {
    if (!user) return;

    try {
      if (section === "basic") {
        const updateData: any = {};
        if (tempData.displayName !== user.displayName) {
          updateData.displayName = tempData.displayName;
        }
        if (tempData.bio !== user.bio) {
          updateData.bio = tempData.bio || undefined;
        }

        await updateBasicMutation.mutateAsync(updateData);
      } else if (section === "idname") {
        if (!idnameInput) {
          alert("ID를 입력해주세요");
          return;
        }

        if (idnameInput === user.idname) {
          setIsEditing((prev) => ({ ...prev, [section]: false }));
          return;
        }

        if (!idnameCheck?.isAvailable) {
          alert("이미 사용 중인 ID입니다");
          return;
        }

        await updateIdnameMutation.mutateAsync({ idname: idnameInput });
      } else if (section === "social") {
        const updateData: any = {};
        if (tempData.github !== user.github) {
          updateData.github = tempData.github || undefined;
        }
        if (tempData.linkedin !== user.linkedin) {
          updateData.linkedin = tempData.linkedin || undefined;
        }
        if (tempData.website !== user.website) {
          updateData.website = tempData.website || undefined;
        }

        await updateSocialMutation.mutateAsync(updateData);
      }

      // 편집 모드 해제
      setIsEditing((prev) => ({ ...prev, [section]: false }));
    } catch (err) {
      console.error(`${section} 저장 실패:`, err);
      alert(err instanceof Error ? err.message : "저장에 실패했습니다");
    }
  };

  // 취소 처리
  const handleCancel = (section: keyof typeof isEditing) => {
    if (!user) return;
    setTempData({ ...user });
    if (section === "idname") {
      setIdnameInput(user.idname || "");
    }
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  // React Query로 아바타 업로드
  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
    } catch (err) {
      console.error("아바타 업로드 실패:", err);
      alert(
        err instanceof Error ? err.message : "아바타 업로드에 실패했습니다"
      );
    }
  };

  // React Query로 아바타 삭제
  const handleAvatarDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
    } catch (err) {
      console.error("아바타 삭제 실패:", err);
      alert(err instanceof Error ? err.message : "아바타 삭제에 실패했습니다");
    }
  };

  // 로딩 상태
  if (loading || !hasHydrated) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  // 에러 상태
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <h3 className="text-lg font-semibold">
                  프로필을 불러올 수 없습니다
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {error?.message ||
                    "로그인이 필요하거나 서버에 문제가 발생했습니다"}
                </p>
              </div>
              <Button onClick={() => loadProfile()} className="mt-4">
                다시 시도
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Profile Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative group">
                  <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={getAvatarUrl(user.avatarUrl)}
                      alt="프로필"
                    />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getAvatarFallback(user)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Image Upload and Remove Buttons */}
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-center">
                      {uploadAvatarMutation.isPending
                        ? "업로드 중..."
                        : "이미지 업로드"}
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadAvatarMutation.isPending}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          handleAvatarUpload(file);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>

                  {user.avatarUrl && user.avatarUrl !== "/placeholder.svg" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      onClick={handleAvatarDelete}
                      disabled={deleteAvatarMutation.isPending}
                    >
                      {deleteAvatarMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      {deleteAvatarMutation.isPending
                        ? "삭제 중..."
                        : "이미지 제거"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                {!isEditing.basic ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {user.displayName}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {user.bio || "소개를 작성해보세요"}
                    </p>
                    <Button
                      onClick={() => handleEdit("basic")}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      편집
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-6 bg-gray-50 rounded-xl border">
                    <div className="space-y-2">
                      <Label
                        htmlFor="displayName"
                        className="text-sm font-medium"
                      >
                        이름
                      </Label>
                      <Input
                        id="displayName"
                        value={tempData.displayName || ""}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        소개
                      </Label>
                      <Textarea
                        id="bio"
                        value={tempData.bio || ""}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className="bg-white resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave("basic")}
                        disabled={updateBasicMutation.isPending}
                      >
                        {updateBasicMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        {updateBasicMutation.isPending ? "저장 중..." : "저장"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel("basic")}
                        disabled={updateBasicMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* ID (idname) Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">사용자 ID</h4>
                  <p className="text-sm text-gray-500">
                    다른 사용자들이 회원님을 찾을 때 사용하는 고유 ID입니다
                  </p>
                </div>
                <Button
                  onClick={() => handleEdit("idname")}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing.idname ? "취소" : "변경"}
                </Button>
              </div>

              {!isEditing.idname ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">@{user.idname}</p>
                    <p className="text-sm text-gray-500">현재 사용자 ID</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-6 bg-gray-50 rounded-xl border">
                  <div className="space-y-2">
                    <Label htmlFor="idname" className="text-sm font-medium">
                      새 사용자 ID
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        @
                      </span>
                      <Input
                        id="idname"
                        value={idnameInput}
                        onChange={(e) => setIdnameInput(e.target.value)}
                        className="bg-white pl-8"
                        placeholder="새로운 ID를 입력하세요"
                      />
                    </div>
                    {idnameInput && idnameCheck && (
                      <p
                        className={`text-xs ${
                          idnameCheck.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {idnameCheck.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      영문, 숫자, 밑줄(_)만 사용 가능합니다
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave("idname")}
                      disabled={updateIdnameMutation.isPending}
                    >
                      {updateIdnameMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      {updateIdnameMutation.isPending ? "저장 중..." : "저장"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel("idname")}
                      disabled={updateIdnameMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">소셜 링크</h4>
                  <p className="text-sm text-gray-500">
                    프로필에 표시될 소셜 미디어 링크
                  </p>
                </div>
                <Button
                  onClick={() => handleEdit("social")}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing.social ? "취소" : "편집"}
                </Button>
              </div>

              {!isEditing.social ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {user.github && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Github className="w-5 h-5 text-gray-700" />
                      <span className="text-sm text-gray-600 truncate">
                        GitHub
                      </span>
                    </div>
                  )}
                  {user.linkedin && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600 truncate">
                        LinkedIn
                      </span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600 truncate">
                        Website
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 p-6 bg-gray-50 rounded-xl border">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </Label>
                    <Input
                      placeholder="https://github.com/username"
                      value={tempData.github || ""}
                      onChange={(e) =>
                        setTempData((prev) => ({
                          ...prev,
                          github: e.target.value,
                        }))
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Label>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={tempData.linkedin || ""}
                      onChange={(e) =>
                        setTempData((prev) => ({
                          ...prev,
                          linkedin: e.target.value,
                        }))
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      웹사이트
                    </Label>
                    <Input
                      placeholder="https://your-website.com"
                      value={tempData.website || ""}
                      onChange={(e) =>
                        setTempData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave("social")}
                      disabled={updateSocialMutation.isPending}
                    >
                      {updateSocialMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      {updateSocialMutation.isPending ? "저장 중..." : "저장"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel("social")}
                      disabled={updateSocialMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 분리된 컴포넌트들 */}
        <NotificationSettings
          email={user.email}
          emailVerified={user.emailVerified}
          settings={{
            commentNotifications: settings.commentNotifications,
            blogUpdates: settings.blogUpdates,
          }}
          onSettingsChange={(newSettings) =>
            setSettings((prev) => ({ ...prev, ...newSettings }))
          }
        />

        <ThemeSettings
          currentTheme={settings.theme}
          onThemeChange={(theme) => setSettings((prev) => ({ ...prev, theme }))}
        />

        <DangerZone />
      </div>
    </div>
  );
}
