"use client"

import Image from "next/image";
import Link from "next/link";
import { Anime } from "@/types/anime";
import { StarIcon } from "@phosphor-icons/react";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="anime-card group cursor-pointer ml-4 mr-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            loading="eager"
          />
          {anime.score && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
              <StarIcon size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-white text-sm font-semibold">
                {anime.score.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">
            {anime.title}
          </h3>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{anime.type || "Unknown"}</span>
            <span>{anime.episodes || "?"} eps</span>
          </div>
        </div>
      </div>
    </Link>
  );
}