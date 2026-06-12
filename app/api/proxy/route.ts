import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTNAME = "api.consumet.org";
const FALLBACK_PROXY_URLS = [
  "https://api.allorigins.win/raw?url=",
  "https://api.allorigins.cf/raw?url=",
];

function isJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") || contentType.includes("text/plain");
}

async function forwardResponse(response: Response) {
  const body = await response.arrayBuffer();
  const headers = new Headers();
  const contentType = response.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  return new Response(body, {
    status: response.status,
    headers,
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url query parameter" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (targetUrl.hostname !== ALLOWED_HOSTNAME) {
    return NextResponse.json({ error: "Proxy only supports api.consumet.org" }, { status: 403 });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
  };

  try {
    const response = await fetch(url, { headers });
    if (response.ok && isJsonResponse(response)) {
      return await forwardResponse(response);
    }
    console.warn("Direct Consumet fetch invalid or blocked", response.status, response.headers.get("content-type"));
  } catch (error) {
    console.warn("Direct Consumet proxy fetch failed", error);
  }

  for (const proxyBase of FALLBACK_PROXY_URLS) {
    try {
      const proxyResponse = await fetch(proxyBase + encodeURIComponent(url), { headers });
      if (proxyResponse.ok && isJsonResponse(proxyResponse)) {
        return await forwardResponse(proxyResponse);
      }
      console.warn("Fallback proxy fetch failed", proxyBase, proxyResponse.status, proxyResponse.headers.get("content-type"));
    } catch (error) {
      console.warn("Fallback proxy request error", proxyBase, error);
    }
  }

  return NextResponse.json(
    { error: "Failed to fetch target URL through proxy" },
    { status: 502 }
  );
}
