import { Anime } from "@/types/anime";
import AnimeCard from "./AnimeCard";

interface AnimeGridProps {
  animeList: Anime[];
}

export default function AnimeGrid({ animeList }: AnimeGridProps) {
  if (!animeList || animeList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Tidak ada anime yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {animeList.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}