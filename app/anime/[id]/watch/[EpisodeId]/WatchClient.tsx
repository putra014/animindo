"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeList from "@/components/EpisodeList";
import { getAnimeById } from "@/lib/jikan";
import { getAnimeEpisodes, getStreamingLinks } from "@/lib/consumet";

const STREAMING_PROVIDER = process.env.NEXT_PUBLIC_STREAMING_PROVIDER || "gogoanime";
const STREAMING_FALLBACK_PROVIDERS = Array.from(new Set([STREAMING_PROVIDER, STREAMING_PROVIDER === "zoro" ? "gogoanime" : "zoro"]));

interface Episode {
  id: string;
  number: number;
  title?: string;
}

export default function WatchClient() {
  const params = useParams();
  const router = useRouter();
  const animeId = params?.id as string;
  const episodeId = params?.episodeId as string;
  
  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [episodeNumber, setEpisodeNumber] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Load anime info & episode list
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        // Ambil info anime dari Jikan
        const animeRes = await getAnimeById(animeId);
        setAnime(animeRes.data);

        // Ambil daftar episode dari Consumet / provider streaming lain
        let episodesRes: any = null;
        for (const provider of STREAMING_FALLBACK_PROVIDERS) {
          try {
            episodesRes = await getAnimeEpisodes(animeId, provider);
            if (episodesRes && episodesRes.episodes) {
              break;
            }
          } catch (err) {
            console.warn(`Episode list fetch failed for provider ${provider}`, err);
            episodesRes = null;
          }
        }

        if (episodesRes && episodesRes.episodes) {
          const epList = episodesRes.episodes.map((ep: any, idx: number) => ({
            id: ep.id,
            number: ep.number || idx + 1,
            title: ep.title,
          }));
          setEpisodes(epList);

          // Cari nomor episode dari episodeId
          const currentEp = epList.find((ep: Episode) => ep.id === episodeId);
          if (currentEp) {
            setEpisodeNumber(currentEp.number);
          }
        } else {
          throw new Error("Tidak dapat memuat daftar episode dari provider streaming");
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data anime");
      } finally {
        setLoading(false);
      }
    }
    
    if (animeId) {
      loadData();
    }
  }, [animeId, episodeId]);

  // Load streaming URL ketika episodeId berubah
  useEffect(() => {
    async function loadStreamingUrl() {
      if (!episodeId) return;

      let streamRes: any = null;
      for (const provider of STREAMING_FALLBACK_PROVIDERS) {
        try {
          streamRes = await getStreamingLinks(episodeId, provider);
          if (streamRes && (streamRes.sources?.length > 0 || streamRes.url)) {
            break;
          }
        } catch (err) {
          console.warn(`Streaming fetch failed for provider ${provider}`, err);
          streamRes = null;
        }
      }

      if (streamRes && streamRes.sources && streamRes.sources.length > 0) {
        // Prioritaskan source dengan quality tertinggi
        const bestSource = streamRes.sources.sort((a: any, b: any) =>
          (b.quality?.replace('p', '') || 0) - (a.quality?.replace('p', '') || 0)
        )[0];
        setVideoUrl(bestSource.url);
      } else if (streamRes && streamRes.url) {
        setVideoUrl(streamRes.url);
      } else {
        console.error("Tidak dapat memuat streaming url dari provider streaming");
        setVideoUrl(null);
      }
    }
    
    loadStreamingUrl();
  }, [episodeId]);

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === episodeId);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      router.push(`/anime/${animeId}/watch/${nextEpisode.id}`);
    }
  };

  const handlePrevEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === episodeId);
    if (currentIndex > 0) {
      const prevEpisode = episodes[currentIndex - 1];
      router.push(`/anime/${animeId}/watch/${prevEpisode.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 h-[400px] rounded-xl"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-8 w-64 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="container-custom py-8 text-center">
        <p className="text-red-600">{error || "Anime tidak ditemukan"}</p>
        <Link href="/" className="mt-4 inline-block text-red-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-red-600">Home</Link>
        {" > "}
        <Link href={`/anime/${animeId}`} className="hover:text-red-600">
          {anime.title}
        </Link>
        {" > "}
        <span>Episode {episodeNumber}</span>
      </div>

      {/* Video Player */}
      <VideoPlayer 
        url={videoUrl} 
        title={`${anime.title} - Episode ${episodeNumber}`}
        onEnded={handleNextEpisode}
      />

      {/* Episode Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevEpisode}
          disabled={episodes.findIndex(ep => ep.id === episodeId) === 0}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          ← Episode Sebelumnya
        </button>
        <button
          onClick={handleNextEpisode}
          disabled={episodes.findIndex(ep => ep.id === episodeId) === episodes.length - 1}
          className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors"
        >
          Episode Selanjutnya →
        </button>
      </div>

      {/* Anime Info */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-2">
          {anime.title} - Episode {episodeNumber}
        </h1>
        {anime.title_english && (
          <p className="text-gray-500 mb-4">{anime.title_english}</p>
        )}
      </div>

      {/* Episode List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Daftar Episode</h2>
        <EpisodeList 
          episodes={episodes} 
          animeId={animeId} 
          currentEpisodeId={episodeId}
        />
      </div>
    </div>
  );
}