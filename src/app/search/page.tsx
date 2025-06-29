"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchPosts } from "@/hooks/usePosts";
import { SearchResultCard } from "@/components/cards";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 쿼리 파라미터 읽기
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // useSearchPosts에서 이미 디바운스 처리됨 (500ms)
  const { data: searchResults, isLoading, error } = useSearchPosts(query);

  // URL 업데이트 함수
  const updateURL = (searchQuery: string) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
      router.replace(`/search?${params.toString()}`, { scroll: false });
    } else {
      router.replace("/search", { scroll: false });
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    updateURL(newQuery);
  };

  // URL 파라미터 변경 감지 (뒤로가기/앞으로가기, 직접 URL 입력)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  console.log(searchResults);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 검색 입력 */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="포스트, 사용자, 태그를 검색해보세요..."
            className="pl-10 h-12 text-lg"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* 검색 결과 개수 */}
      {searchResults && searchResults.posts.length > 0 && (
        <div className="mb-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold">
            검색 결과 ({searchResults.total}개)
          </h2>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && query.trim() && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-500">검색 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">검색 중 오류가 발생했습니다.</p>
        </div>
      )}

      {/* 검색 결과 */}
      {searchResults && searchResults.posts.length > 0 && (
        <div className="space-y-6">
          {searchResults.posts.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 검색 결과가 없을 때 */}
      {searchResults &&
        searchResults.posts.length === 0 &&
        query.trim() &&
        !isLoading && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              "{query.trim()}"에 대한 검색 결과를 찾을 수 없습니다.
            </p>
          </div>
        )}

      {/* 초기 상태 */}
      {!query.trim() && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색어를 입력해주세요
          </h3>
          <p className="text-gray-500">
            포스트, 사용자, 태그 등을 검색할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
