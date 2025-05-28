import type { MutableRefObject } from "react";

export interface TreeItem {
	id: string;
	name: string;
	type: "course" | "module" | "lesson";
	children: TreeItem[];
	collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
	parentId: null | string;
	depth: number;
	index: number;
}

export type SensorContext = MutableRefObject<{
	items: FlattenedItem[];
	offset: number;
}>;

/// New Types
export interface CourseTreeItem {
	id: number;
	type: "module" | "lesson";
	clientId: string;
	name: string;
	children: CourseTreeItem[]; // type lesson cannot haev children
	order: number;
	// children: UiSlot[];
	// collapsed?: boolean;
}

export interface FlattenedCourseTreeItem extends CourseTreeItem {
	parentId: null | string;
	depth: number;
	index: number;
}

// export interface CourseLesson extends CourseTreeItem {
// 	type: "lesson";
// 	children: never;
// }
