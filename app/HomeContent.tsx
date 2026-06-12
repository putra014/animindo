"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AnimeGrid from "@/components/AnimeGrid";
import Pagination from "@/components/Pagination";
import SkeletonCard from "@/components/SkeletonCard";
import GenreFilter from "@/components/GenreFilter";
import { Anime } from "@/types/anime";

interface HomeContentProps {
  initialGenre: number | null;
  initialPage: number;
}

export default function HomeContent({ initialGenre, initialPage }: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGenre, setCurrentGenre] = useState<number | null>(initialGenre);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch data ketika genre atau page berubah
  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      setError(null);
      
      try {
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime?page=${currentPage}&limit=24`;
        if (currentGenre) {
          url += `&genres=${currentGenre}`;
        } else {
          // Jika tidak ada genre, ambil top anime (filter by popularity)
          url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/top/anime?page=${currentPage}&limit=24`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Gagal mengambil data anime");
        const data = await response.json();
        setAnimeList(data.data);
        setTotalPages(data.pagination.last_visible_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnime();
  }, [currentGenre, currentPage]);

  const handleGenreChange = (genreId: number | null) => {
    setCurrentGenre(genreId);
    setCurrentPage(1);
    // URL update dilakukan oleh GenreFilter, tapi kita sync state
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL tanpa reload penuh
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (currentGenre) {
      params.set("genre", currentGenre.toString());
    } else {
      params.delete("genre");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div>
      <GenreFilter onGenreChange={handleGenreChange} />
      
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
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
  );
}