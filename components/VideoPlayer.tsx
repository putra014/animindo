"use client";

import { useState, useEffect } from "react";
import ReactPlayer from "react-player";


interface VideoPlayerProps {
  url: string | null;
  title: string;
  onEnded?: () => void;
}

export default function VideoPlayer({ url, title, onEnded }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  if (!isClient || !url) {
    return (
      <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center">
        <p className="text-gray-400">
          {!url ? "Video tidak tersedia" : "Loading player..."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
      />
      {!playing && (
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
          {title}
        </div>
      )}
    </div>
  );
}