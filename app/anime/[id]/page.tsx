import { Suspense } from "react";
import AnimeDetailClient from "./AnimeDetailClient";
import { getAnimeById } from "@/lib/jikan";
import Link from "next/link"

// Generate metadata dari server (SEO tetap bagus)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const response = await getAnimeById(id);
    const anime = response.data;
    return {
      title: `${anime.title} - AnimIndo`,
      description:
        anime.synopsis?.slice(0, 160) || "Detail anime dari AnimIndo",
    };
  } catch {
    return {
      title: "Anime Not Found - AnimIndo",
      description: "Detail anime tidak ditemukan",
    };
  }
}


export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let anime: any = null;
  try {
    const response = await getAnimeById(id);
    anime = response.data;
  } catch (e) {
    anime = null;
  }
  return (
    <Suspense
      fallback={
        <div className="container-custom py-8 text-center">Loading...</div>
      }
    >
      <AnimeDetailClient id={id} />
      {anime?.episodes && anime.episodes > 0 && (
        <Link
          href={`/anime/${id}/watch/1`}
          className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          🎬 Tonton Episode 1
        </Link>
      )}
    </Suspense>
  );
}
