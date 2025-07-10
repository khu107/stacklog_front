"use client";

import React from "react";
import { Bell, Construction, Clock } from "lucide-react";

export default function Notifications() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* 아이콘 영역 */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-black-600" />
          </div>
        </div>

        {/* 메인 메시지 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">알림 페이지</h1>
        <p className="text-gray-600 mb-6">현재 개발 중인 기능입니다</p>

        {/* 진행상황 표시 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">작업 진행 중</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: "45%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">45% 완료</p>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="bg-black  text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
