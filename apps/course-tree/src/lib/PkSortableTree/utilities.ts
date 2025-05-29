import { UiCourseDisplay, CourseDisplay } from "@pete_keen/courses/validators";
import { CourseTreeItem, FlattenedCourseTreeItem } from "./types";

export function courseDisplayToUi(course: CourseDisplay): UiCourseDisplay {
	return {
		...course,
		slots: course.slots.map((slot, i) => {
			const topLevelClientId = slot.id
				? `slot-${slot.id}`
				: `new-slot-${i}`;

			const moduleSlots = slot.moduleSlots?.map((lessonSlot, j) => ({
				...lessonSlot,
				clientId: lessonSlot.id
					? `module-slot-${lessonSlot.id}`
					: `new-module-slot-${j}`,
			}));

			return {
				...slot,
				clientId: topLevelClientId,
				moduleSlots,
			};
		}),
	};
}

export function courseDisplayToTree(course: CourseDisplay): CourseTreeItem[] {
	return course.slots.map((slot, i) => {
		return {
			id: slot.id,
			order: slot.order,
			moduleId: slot.moduleId,
			lessonId: slot.lessonId,
			type: slot.moduleId ? "module" : "lesson",
			name: slot.display.name,
			children:
				slot.moduleSlots?.map((lessonSlot) => ({
					id: lessonSlot.id,
					order: lessonSlot.order,
					moduleId: lessonSlot.moduleId,
					lessonId: lessonSlot.lessonId,
					type: "lesson",
					name: lessonSlot.display.name,
					children: [],
				})) || [],
		};
	});
}

export function flatten(
	items: CourseTreeItem[],
	parentId: string | null = null,
	depth = 0
): FlattenedCourseTreeItem[] {
	return items.reduce<FlattenedCourseTreeItem[]>((acc, item, index) => {
		const clientId = parentId
			? `${parentId}-${index}`
			: index.toString();
		return [
			...acc,
			{ ...item, parentId, depth, index, clientId },
			...flatten(item.children, clientId, depth + 1),
		];
	}, []);
}

export function flattenTree(
	items: CourseTreeItem[]
): FlattenedCourseTreeItem[] {
	return flatten(items);
}
