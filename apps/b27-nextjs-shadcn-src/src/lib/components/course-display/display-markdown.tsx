import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export function DisplayMarkdown({ content }: { content: string }) {
	return (
		<ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
			{content}
		</ReactMarkdown>
	);
}
