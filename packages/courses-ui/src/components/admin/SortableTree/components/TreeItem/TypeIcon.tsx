import {
	Folder,
	Book,
	FileText,
	FileQuestion,
	Presentation,
} from "lucide-react";

export const TypeIcon = ({
	type,
}: {
	type: "module" | "lesson" | "quiz" | "file";
}) => {
	switch (type) {
		case "module":
			return <Folder />;
		case "lesson":
			return <Presentation />;
		case "quiz":
			return <FileQuestion />;
		case "file":
			return <FileText />;
	}
};
