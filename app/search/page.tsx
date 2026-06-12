"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnimeGrid from "@/components/AnimeGrid";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import SkeletonCard from "@/components/SkeletonCard";
import { Anime } from "@/types/anime";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setAnimeList([]);
      return;
    }

    async function fetchSearchResults() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${currentPage}&limit=24`
        );
        
        if (!response.ok) throw new Error("Gagal mengambil data");
        
        const data = await response.json();
        setAnimeList(data.data);
        setTotalPages(data.pagination.last_visible_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`);
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Pencarian Anime
        </h1>
        <SearchBar initialQuery={query} />
      </div>

      {query && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Hasil pencarian untuk "{query}"
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <>
              <AnimeGrid animeList={animeList} />
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}