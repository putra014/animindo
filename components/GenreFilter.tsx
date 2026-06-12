"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Genre {
  mal_id: number;
  name: string;
}

interface GenreFilterProps {
  onGenreChange?: (genreId: number | null) => void;
}

export default function GenreFilter({ onGenreChange }: GenreFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenreId = searchParams.get("genre") || "";
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>(currentGenreId);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/genres/anime`);
        const data = await response.json();
        setGenres(data.data.slice(0, 20)); // Batasi 20 genre utama
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGenres();
  }, []);

  const handleGenreClick = (genreId: string) => {
    setSelectedGenre(genreId);
    onGenreChange?.(genreId ? Number(genreId) : null);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (genreId) {
      params.set("genre", genreId);
      params.delete("page"); // Reset page when genre changes
    } else {
      params.delete("genre");
    }
    router.push(`/?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 pr-4 pl-4 md:pr-8 md:pl-8">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Filter Genre</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleGenreClick("")}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            selectedGenre === ""
              ? "bg-red-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Semua
        </button>
        {genres.map((genre) => (
          <button
            key={genre.mal_id}
            onClick={() => handleGenreClick(genre.mal_id.toString())}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedGenre === genre.mal_id.toString()
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}