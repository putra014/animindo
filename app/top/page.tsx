import { Suspense } from "react";
import AnimeGrid from "@/components/AnimeGrid";
import SkeletonCard from "@/components/SkeletonCard";
import { getTopAnime } from "@/lib/jikan";

export default async function TopAnimePage() {
  const data = await getTopAnime(1, 24);
  const animeList = data.data;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Top Anime Sepanjang Masa
      </h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <AnimeGrid animeList={animeList} />
      </Suspense>
    </div>
  );
}