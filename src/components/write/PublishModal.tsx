"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import { useUploadImage } from "@/hooks/usePosts";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (publishData: PublishData) => void;
  isLoading?: boolean;
}

export interface PublishData {
  summary: string;
  thumbnail: string;
  isPrivate: boolean;
}

export default function PublishModal({
  isOpen,
  onClose,
  onPublish,
  isLoading = false,
}: PublishModalProps) {
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 React Query 이미지 업로드 훅 (한 번만 선언)
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  // 썸네일 파일 업로드
  const handleThumbnailUpload = (file: File) => {
    uploadImage(file, {
      onSuccess: (data) => {
        console.log("✅ 썸네일 업로드 성공:", data);

        // 🔥 full URL 생성
        const fullUrl = data.url.startsWith("http")
          ? data.url
          : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${
              data.url
            }`;

        setThumbnail(fullUrl);
        setThumbnailPreview(URL.createObjectURL(file));

        console.log("🖼️ 설정된 썸네일 URL:", fullUrl);
        alert("썸네일이 업로드되었습니다.");
      },
      onError: (error) => {
        console.error("❌ 썸네일 업로드 실패:", error);
        alert("썸네일 업로드에 실패했습니다.");
      },
    });
  };

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      handleThumbnailUpload(file);
    }
  };

  // 썸네일 제거
  const removeThumbnail = () => {
    setThumbnail("");
    setThumbnailPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 출간 처리
  const handleSubmit = () => {
    onPublish({
      summary: summary.trim(),
      thumbnail,
      isPrivate,
    });
  };

  // 모달 닫기 시 초기화
  const handleClose = () => {
    setSummary("");
    setThumbnail("");
    setThumbnailPreview("");
    setIsPrivate(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">출간 설정</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 요약글 입력 */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium">
              요약글
            </Label>
            <Textarea
              id="summary"
              placeholder="이 글에 대한 간단한 요약을 작성해주세요... (선택사항)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 text-right">
              {summary.length}/500
            </div>
          </div>

          {/* 썸네일 설정 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">썸네일 이미지</Label>

            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="썸네일 미리보기"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  onClick={removeThumbnail}
                  disabled={isUploading || isLoading}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() =>
                  !isUploading && !isLoading && fileInputRef.current?.click()
                }
                className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
                  isUploading || isLoading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:border-gray-400"
                }`}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {isUploading
                    ? "업로드 중..."
                    : "클릭해서 썸네일을 업로드하세요"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF (최대 5MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading || isLoading}
            />
          </div>

          {/* 공개/비공개 설정 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-medium">공개 설정</Label>
              <p className="text-xs text-gray-600">
                {isPrivate
                  ? "나만 볼 수 있는 비공개 글입니다"
                  : "모든 사람이 볼 수 있는 공개 글입니다"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="privacy-toggle" className="text-sm">
                {isPrivate ? "비공개" : "공개"}
              </Label>
              <Switch
                id="privacy-toggle"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading || isUploading}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "출간 중..." : "출간하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
