"use client";
import { FullContentItem } from "@pete_keen/courses-remake/validators";
import { LessonEdit } from "../lesson/LessonEdit";

export const ContentEditForm = ({
	contentItem,
	updateContent,
	deleteContent,
}: {
	contentItem: FullContentItem;
	updateContent: (data: FullContentItem) => Promise<void>;
	deleteContent: (id: number) => Promise<void>;
}) => {
	switch (contentItem.type) {
		case "lesson": {
			return (
				<LessonEdit
					lesson={contentItem}
					updateLesson={updateContent}
					deleteContent={deleteContent}
				/>
			);
		}
		case "module": {
			return <div>Module</div>;
		}
		case "file": {
			return <div>File</div>;
		}
		case "quiz": {
			return <div>Quiz</div>;
		}
	}
};
