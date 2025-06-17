import type { RefObject } from "react";

// export interface TreeItem {
// 	id: string;
// 	name: string;
// 	// type: "course" | "module" | "lesson";
// 	children: TreeItem[];
// 	collapsed?: boolean;
// }

// export type TreeItems = TreeItem[];

// export interface FlattenedItem extends TreeItem {
// 	parentId: null | string;
// 	depth: number;
// 	index: number;
// }

/// New Types
export interface CourseTreeItem {
	id: number | undefined;
	type: "module" | "lesson";
	name: string;
	children: CourseTreeItem[]; // type lesson cannot have children
	order: number; // have to see how this works (maybe its just added at saving time
	moduleId: number | null;
	lessonId: number | null;
	clientId: string;
	collapsed?: boolean;
	isPublished: boolean;
	// collapsed?: boolean;
}

export interface FlattenedCourseTreeItem extends CourseTreeItem {
	// clientId: string;
	parentId: null | string;
	depth: number;
	index: number;
}

// export interface CourseLesson extends CourseTreeItem {
// 	type: "lesson";
// 	children: never;
// }

export type SensorContext = RefObject<{
	items: FlattenedCourseTreeItem[];
	offset: number;
}>;
