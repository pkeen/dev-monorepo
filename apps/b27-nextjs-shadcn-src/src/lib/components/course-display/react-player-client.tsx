// src/lib/components/course-display/react-player-client.tsx
"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), {
	ssr: false,
});

export default ReactPlayer;
