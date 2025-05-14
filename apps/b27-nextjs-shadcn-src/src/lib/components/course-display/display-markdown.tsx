import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

export function DisplayMarkdown({ content }: { content: string }) {
	// Allow iframes
	const schema = {
		...defaultSchema,
		tagNames: [...defaultSchema.tagNames!, "iframe"],
		attributes: {
			...defaultSchema.attributes,
			iframe: [
				"src",
				"width",
				"height",
				"frameborder",
				"allow",
				"allowfullscreen",
				"style",
			],
		},
	};

	return (
		<ReactMarkdown
			// rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
			skipHtml={true}
		>
			{content}
		</ReactMarkdown>
	);
}
