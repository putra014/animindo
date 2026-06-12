"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  CalendarIcon,
  ClockIcon,
  FilmStripIcon,
  UsersIcon,
  Clock,
} from "@phosphor-icons/react";
import { Anime } from "@/types/anime";

export default function AnimeDetailClient({ id }: { id: string }) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime/${id}`,
        );
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setAnime(data.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-8 text-center">
        Memuat detail anime...
      </div>
    );
  }

  if (error || !anime) {
    notFound();
  }

  // Render detail anime sama seperti sebelumnya (gunakan kode dari panduan awal)
  return (
    <div className="container-custom py-8 pr-4 pl-4 md:pr-8 md:pl-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <div className="relative h-[400px] md:h-[500px]">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {anime.title}
          </h1>
          {anime.title_english && (
            <p className="text-gray-300 text-lg mb-4">{anime.title_english}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {anime.score && (
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <StarIcon
                  className="text-yellow-500 fill-yellow-500"
                  size={18}
                />
                <span className="text-white font-semibold">{anime.score}</span>
              </div>
            )}
            <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white">
              {anime.status}
            </span>
            <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white">
              {anime.type}
            </span>
            <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white">
              {anime.episodes} Episode
            </span>
          </div>
        </div>
      </div>

      {/* Grid info - sama seperti sebelumnya */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {anime.synopsis || "Sinopsis tidak tersedia."}
            </p>
          </div>
          {/* Background dan Trailer jika ada */}
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Informasi</h2>
            <div className="space-y-3">
              <InfoRow
                icon={CalendarIcon}
                label="Musim & Tahun"
                value={`${anime.season || "?"} ${anime.year || ""}`}
              />
              <InfoRow
                icon={ClockIcon}
                label="Durasi"
                value={anime.duration || "?"}
              />
              <InfoRow
                icon={FilmStripIcon}
                label="Rating"
                value={anime.rating || "?"}
              />
              <InfoRow
                icon={UsersIcon}
                label="Member"
                value={anime.members?.toLocaleString() || "?"}
              />
            </div>
          </div>
          {/* Genres & Studios */}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="text-gray-500 dark:text-gray-400 mt-0.5" size={18} />
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
