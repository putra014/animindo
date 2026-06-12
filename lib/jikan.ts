// src/lib/jikan.ts

import { Anime, JikanResponse } from "@/types/anime";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

interface FetchOptions {
  cache?: RequestCache;
  next?: { revalidate?: number };
}

async function fetchFromJikan<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get top anime (halaman awal, filter berdasarkan popularity)
export async function getTopAnime(page: number = 1, limit: number = 24) {
  return fetchFromJikan<any>(`/top/anime?page=${page}&limit=${limit}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
}

// Search anime by query
export async function searchAnime(query: string, page: number = 1, limit: number = 24) {
  if (!query) return null;
  return fetchFromJikan<any>(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
    next: { revalidate: 60 }, // Revalidate more frequently for search results
  });
}

// Get anime detail by ID
export async function getAnimeById(id: string) {
  return fetchFromJikan<JikanResponse<Anime>>(`/anime/${id}`, {
    next: { revalidate: 86400 }, // Revalidate once per day for detailed content
  });
}

// Get anime by genre
export async function getAnimeByGenre(genreId: number, page: number = 1, limit: number = 24) {
  return fetchFromJikan<any>(`/anime?genres=${genreId}&page=${page}&limit=${limit}`, {
    next: { revalidate: 3600 },
  });
}

// Get upcoming anime (seasonal anime that haven't aired yet)
export async function getUpcomingAnime(page: number = 1, limit: number = 24) {
  return fetchFromJikan<any>(`/seasons/upcoming?page=${page}&limit=${limit}`, {
    next: { revalidate: 43200 }, // Revalidate twice per day
  });
}

// Get list of all anime genres
export async function getAnimeGenres() {
  return fetchFromJikan<any>(`/genres/anime`, {
    next: { revalidate: 604800 }, // Revalidate once per week (genres rarely change)
  });
}

// Get recommended anime
export async function getRecommendations(limit: number = 10) {
  return fetchFromJikan<any>(`/recommendations/anime?limit=${limit}`, {
    next: { revalidate: 86400 },
  });
}

// Get seasonal anime (current season)
export async function getSeasonalAnime(year: number, season: string, page: number = 1, limit: number = 24) {
  return fetchFromJikan<any>(`/seasons/${year}/${season}?page=${page}&limit=${limit}`, {
    next: { revalidate: 21600 }, // Revalidate 4 times per day for seasonal updates
  });
}