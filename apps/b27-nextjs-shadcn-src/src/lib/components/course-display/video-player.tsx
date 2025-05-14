// "use client";

// video-player.tsx
import ReactPlayer from './react-player-client';

export function VideoPlayer({ provider, url }: { provider: string; url: string }) {
  if (["youtube", "vimeo"].includes(provider)) {
    return (
      <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          <ReactPlayer url={url} controls width="100%" height="100%" />
        </div>
      </div>
    );
  }

  if (["r2", "bunny"].includes(provider)) {
    return (
      <video controls width="100%">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <p>Unsupported provider</p>;
}

