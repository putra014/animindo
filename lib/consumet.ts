const CONSUMET_API = "https://api.consumet.org";
const DEFAULT_STREAMING_PROVIDER = process.env.NEXT_PUBLIC_STREAMING_PROVIDER || "gogoanime";
const LOCAL_PROXY_PATH = "/api/proxy?url=";

function isBrowser() {
  return typeof window !== "undefined";
}

async function fetchConsumet(endpoint: string, useProxy: boolean) {
  const targetUrl = `${CONSUMET_API}${endpoint}`;
  const fetchUrl = useProxy ? `${LOCAL_PROXY_PATH}${encodeURIComponent(targetUrl)}` : targetUrl;

  const response = await fetch(fetchUrl, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${fetchUrl}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  return response.json();
}

async function fetchConsumetWithProxyFallback(endpoint: string) {
  try {
    if (isBrowser()) {
      return await fetchConsumet(endpoint, true);
    }

    return await fetchConsumet(endpoint, false);
  } catch {
    return await fetchConsumet(endpoint, true);
  }
}

// Ambil daftar episode berdasarkan anime ID dari provider Consumet
export async function getAnimeEpisodes(animeId: string, provider: string = DEFAULT_STREAMING_PROVIDER) {
  return fetchConsumetWithProxyFallback(`/anime/${provider}/info/${animeId}`);
}

// Ambil streaming URL untuk episode tertentu
export async function getStreamingLinks(episodeId: string, provider: string = DEFAULT_STREAMING_PROVIDER) {
  return fetchConsumetWithProxyFallback(`/anime/${provider}/watch/${episodeId}`);
}
