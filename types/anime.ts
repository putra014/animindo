export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  type: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  season: string | null;
  year: number | null;
  genres: Array<{
    mal_id: number;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    name: string;
    url: string;
  }>;
  producers: Array<{
    mal_id: number;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    name: string;
    url: string;
  }>;
  duration: string | null;
  rating: string | null;
  background: string | null;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
}

export interface JikanResponse<T> {
  data: T;
  pagination: {
    current_page: number;
    last_visible_page: number;
    has_next_page: boolean;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeListResponse {
  data: Anime[];
  pagination: {
    current_page: number;
    last_visible_page: number;
    has_next_page: boolean;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}