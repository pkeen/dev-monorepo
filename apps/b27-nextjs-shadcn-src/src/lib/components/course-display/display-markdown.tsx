import ReactMarkdown from "react-markdown";

export const DisplayMarkdown = ({ markdown }: { markdown: string }) => {
	return <ReactMarkdown>{markdown}</ReactMarkdown>;
};
