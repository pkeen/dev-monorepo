"use client";
import {
	FullContentItem,
	VideoContentItem,
} from "@pete_keen/courses-remake/validators";
import { LessonEdit } from "../lesson/LessonEdit";
import { ModuleEdit } from "../module/ModuleEditForm";

export const ContentEditForm = ({
	contentItem,
	videos,
	updateContent,
	deleteContent,
}: {
	contentItem: FullContentItem;
	videos: VideoContentItem[];
	updateContent: (data: FullContentItem) => Promise<void>;
	deleteContent: (id: number) => Promise<void>;
}) => {
	switch (contentItem.type) {
		case "lesson": {
			return (
				<LessonEdit
					lesson={contentItem}
					videos={videos}
					updateLesson={updateContent}
					deleteContent={deleteContent}
				/>
			);
		}
		case "module": {
			return (
				<ModuleEdit
					moduleContent={contentItem}
					updateModule={updateContent}
					deleteContent={deleteContent}
				/>
			);
		}
		case "file": {
			return <div>File</div>;
		}
		case "quiz": {
			return <div>Quiz</div>;
		}
	}
};
