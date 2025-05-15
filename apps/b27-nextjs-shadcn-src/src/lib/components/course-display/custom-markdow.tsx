import ReactMarkdown from "react-markdown";
import { VideoPlayer } from "./video-player";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export function CustomMarkdown({ content }: { content: string }) {
	return (
		<ReactMarkdown
			components={{
				code({ node, className, children, ...props }) {
					const isVideo = className === "language-video";
					if (isVideo) {
						const lines = String(children)
							.split("\n")
							.filter(Boolean);
						const config: Record<string, string> = {};
						for (const line of lines) {
							const [key, ...rest] = line.split(":");
							config[key.trim()] = rest.join(":").trim();
						}

						return (
							<div style={{ margin: "1rem 0" }}>
								<VideoPlayer
									provider={config.provider}
									url={config.url}
								/>
							</div>
						);
					}

					return (
						<code className={className} {...props}>
							{children}
						</code>
					);
				},
			}}
			rehypePlugins={[rehypeRaw, rehypeSanitize]}
		>
			{content}
		</ReactMarkdown>
	);
}
