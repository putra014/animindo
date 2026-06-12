"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Play } from "@phosphor-icons/react";

interface Episode {
  id: string;
  number: number;
  title?: string;
  isFiller?: boolean;
}

interface EpisodeListProps {
  episodes: Episode[];
  animeId: string;
  currentEpisodeId?: string;
}

export default function EpisodeList({ episodes, animeId, currentEpisodeId }: EpisodeListProps) {
  const pathname = usePathname();

  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada episode tersedia
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[400px] overflow-y-auto p-2">
      {episodes.map((episode) => {
        const isActive = currentEpisodeId === episode.id;
        const episodePath = `/anime/${animeId}/watch/${episode.id}`;
        
        return (
          <Link
            key={episode.id}
            href={episodePath}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-all
              ${isActive 
                ? "bg-red-600 text-white ring-2 ring-red-400" 
                : "bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/50"
              }
            `}
          >
            <Play size={16} className={isActive ? "text-white" : "text-gray-500"} />
            <span className="text-sm font-medium mt-1">
              {episode.number}
            </span>
            {episode.isFiller && (
              <span className="text-xs text-yellow-500">Filler</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}