// src/app/page.tsx
import { Suspense } from "react";
import AnimeGrid from "@/components/AnimeGrid";
import SkeletonCard from "@/components/SkeletonCard";
import GenreFilter from "@/components/GenreFilter";
import Pagination from "@/components/Pagination";
import { getTopAnime, getAnimeByGenre } from "@/lib/jikan";

interface HomePageProps {
  searchParams: Promise<{ page?: string; genre?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const genreId = params.genre ? Number(params.genre) : null;
  
  let animeList = [];
  let pagination = { current_page: 1, last_visible_page: 1, has_next_page: false };
  
  if (genreId) {
    const data = await getAnimeByGenre(genreId, currentPage, 24);
    animeList = data.data;
    pagination = data.pagination;
  } else {
    const data = await getTopAnime(currentPage, 24);
    animeList = data.data;
    pagination = data.pagination;
  }

  return (
    <div className="container-custom py-8">
      {/* Hero Section */}
      <section className="py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Database Anime Terlengkap
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Temukan informasi lengkap tentang anime favorit Anda, dari sinopsis, rating,
          hingga informasi rilis.
        </p>
      </section>

      {/* Genre Filter */}
      <GenreFilter />

      {/* Anime Grid */}
      <section>
        <div className="flex justify-between items-center mb-6 ml-2 mr-2 md:ml-4 md:mr-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {genreId ? "Anime berdasarkan genre" : "Anime Populer"}
          </h2>
        </div>
        <Suspense fallback={<AnimeGridSkeleton />}>
          <AnimeGrid animeList={animeList} />
        </Suspense>
        
        {/* Pagination */}
        {pagination.last_visible_page > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_visible_page}
              basePath="/"
              queryParams={genreId ? { genre: genreId.toString() } : {}}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function AnimeGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}