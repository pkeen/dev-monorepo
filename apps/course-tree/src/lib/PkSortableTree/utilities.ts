"use client";

import { UiCourseDisplay, CourseDisplay } from "@pete_keen/courses/validators";
import { CourseTreeItem, FlattenedCourseTreeItem } from "./components/types";
import { arrayMove } from "@dnd-kit/sortable";
import { findItem } from "../SortableTree/utilities";

// export function courseDisplayToUi(course: CourseDisplay): UiCourseDisplay {
// 	return {
// 		...course,
// 		slots: course.slots.map((slot, i) => {
// 			const topLevelClientId = slot.id
// 				? `slot-${slot.id}`
// 				: `new-slot-${i}`;

// 			const moduleSlots = slot.moduleSlots?.map((lessonSlot, j) => ({
// 				...lessonSlot,
// 				clientId: lessonSlot.id
// 					? `module-slot-${lessonSlot.id}`
// 					: `new-module-slot-${j}`,
// 			}));

// 			return {
// 				...slot,
// 				clientId: topLevelClientId,
// 				moduleSlots,
// 			};
// 		}),
// 	};
// }

// export function courseDisplayToTree(course: CourseDisplay): CourseTreeItem[] {
// 	return course.slots.map((slot, i) => {
// 		return {
// 			id: slot.id,
// 			order: slot.order,
// 			moduleId: slot.moduleId,
// 			lessonId: slot.lessonId,
// 			type: slot.moduleId ? "module" : "lesson",
// 			name: slot.display.name,
// 			clientId: `${i}`,
// 			children:
// 				slot.moduleSlots?.map((lessonSlot, j) => ({
// 					id: lessonSlot.id,
// 					order: lessonSlot.order,
// 					moduleId: lessonSlot.moduleId,
// 					lessonId: lessonSlot.lessonId,
// 					type: "lesson",
// 					name: lessonSlot.display.name,
// 					clientId: `${i}-${j}`,
// 					children: [],
// 				})) || [],
// 		};
// 	});
// }

export function flatten(
	items: CourseTreeItem[],
	parentId: string | null = null,
	depth = 0
): FlattenedCourseTreeItem[] {
	return items.reduce<FlattenedCourseTreeItem[]>((acc, item, index) => {
		// const clientId = parentId ? `${parentId}-${index}` : index.toString();
		return [
			...acc,
			{ ...item, parentId, depth, index },
			...flatten(item.children, item.clientId, depth + 1),
		];
	}, []);
}

export function flattenTree(
	items: CourseTreeItem[]
): FlattenedCourseTreeItem[] {
	return flatten(items);
}

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

// This now makes sense as clientId was hoisted up to treeitem
export function removeItem(items: CourseTreeItem[], clientId: string) {
	const newItems: CourseTreeItem[] = [];

	for (const item of items) {
		if (item.clientId === clientId) {
			continue;
		}

		if (item.children.length) {
			item.children = removeItem(item.children, clientId);
		}

		newItems.push(item);
	}

	return newItems;
}

export function findItemDeep(
	items: CourseTreeItem[],
	itemClientId: string
): CourseTreeItem | undefined {
	for (const item of items) {
		const { clientId, children } = item;

		if (clientId === itemClientId) {
			return item;
		}

		if (children.length) {
			const child = findItemDeep(children, itemClientId);

			if (child) {
				return child;
			}
		}
	}

	return undefined;
}

function countChildren(items: CourseTreeItem[], count = 0): number {
	return items.reduce((acc, { children }) => {
		if (children.length) {
			return countChildren(children, acc + 1);
		}

		return acc + 1;
	}, count);
}

export function getChildCount(items: CourseTreeItem[], itemClientId: string) {
	if (!itemClientId) {
		return 0;
	}

	const item = findItemDeep(items, itemClientId);

	return item ? countChildren(item.children) : 0;
}

export function getProjection(
	items: FlattenedCourseTreeItem[],
	activeId: string,
	overId: string,
	dragOffset: number,
	indentationWidth: number
) {
	const overItemIndex = items.findIndex(
		({ clientId }) => clientId === overId
	);
	const activeItemIndex = items.findIndex(
		({ clientId }) => clientId === activeId
	);
	const activeItem = items[activeItemIndex];
	const newItems = arrayMove(items, activeItemIndex, overItemIndex);
	const previousItem = newItems[overItemIndex - 1];
	const nextItem = newItems[overItemIndex + 1];
	const dragDepth = getDragDepth(dragOffset, indentationWidth);
	const projectedDepth = activeItem.depth + dragDepth;
	const maxDepth = getMaxDepth({
		previousItem,
	});
	const minDepth = getMinDepth({ nextItem });
	let depth = projectedDepth;

	if (projectedDepth >= maxDepth) {
		depth = maxDepth;
	} else if (projectedDepth < minDepth) {
		depth = minDepth;
	}

	return { depth, maxDepth, minDepth, parentId: getParentId() };

	function getParentId() {
		if (depth === 0 || !previousItem) {
			return null;
		}

		if (depth === previousItem.depth) {
			return previousItem.parentId;
		}

		if (depth > previousItem.depth) {
			return previousItem.clientId;
		}

		const newParent = newItems
			.slice(0, overItemIndex)
			.reverse()
			.find((item) => item.depth === depth)?.parentId;

		return newParent ?? null;
	}
}

export function getDragDepth(offset: number, indentationWidth: number) {
	return Math.round(offset / indentationWidth);
}

export function getMaxDepth({
	previousItem,
}: {
	previousItem: FlattenedCourseTreeItem;
}) {
	if (previousItem) {
		return previousItem.depth + 1;
	}

	return 0;
}

export function getMinDepth({
	nextItem,
}: {
	nextItem: FlattenedCourseTreeItem;
}) {
	if (nextItem) {
		return nextItem.depth;
	}

	return 0;
}

export function setProperty<T extends keyof CourseTreeItem>(
	items: CourseTreeItem[],
	id: string,
	property: T,
	setter: (value: CourseTreeItem[T]) => CourseTreeItem[T]
) {
	for (const item of items) {
		if (item.clientId === id) {
			item[property] = setter(item[property]);
			continue;
		}

		if (item.children.length) {
			item.children = setProperty(item.children, id, property, setter);
		}
	}

	return [...items];
}

export function buildTree(
	flattenedItems: FlattenedCourseTreeItem[]
): CourseTreeItem[] {
	const root: CourseTreeItem = {
		clientId: "root",
		children: [],
		id: 0,
		type: "module",
		name: "root",
		order: 0,
		moduleId: null,
		lessonId: null,
	};
	const nodes: Record<string, CourseTreeItem> = { [root.clientId]: root };
	// Clone and register all nodes
	for (const item of flattenedItems) {
		nodes[item.clientId] = {
			...item,
			children: [],
		};
	}

	// Build hierarchy
	for (const item of flattenedItems) {
		const parentId = item.parentId ?? root.clientId;
		const parent = nodes[parentId];

		if (parent) {
			parent.children.push(nodes[item.clientId]);
		} else {
			console.warn(`Parent ${parentId} not found for item`, item);
		}
	}
	return root.children;
}

// const isDescendant = (parentId: string, childId: string): boolean => {
// 	if (parentId === childId) return true;

// 	const stack = [childId];
// 	while (stack.length > 0) {
// 		const currentId = stack.pop();
// 		const currentItem = flattenedItems.find(
// 			(item) => item.clientId === currentId
// 		);
// 		if (!currentItem || !currentItem.parentId) continue;
// 		if (currentItem.parentId === parentId) return true;
// 		stack.push(currentItem.parentId);
// 	}

// 	return false;
// };

export function removeChildrenOf(
	items: FlattenedCourseTreeItem[],
	ids: string[]
) {
	const excludeParentIds = [...ids];

	return items.filter((item) => {
		if (item.parentId && excludeParentIds.includes(item.parentId)) {
			if (item.children.length) {
				excludeParentIds.push(item.clientId);
			}
			return false;
		}

		return true;
	});
}

export function isLesson(item: FlattenedCourseTreeItem): boolean {
	return item.type === "lesson";
}

export function isModule(item: FlattenedCourseTreeItem): boolean {
	return item.type === "module";
}

export function isTopLevel(item: FlattenedCourseTreeItem): boolean {
	return item.parentId === null;
}
