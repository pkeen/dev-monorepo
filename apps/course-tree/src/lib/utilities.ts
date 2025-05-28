import { UiCourseDisplay, CourseDisplay } from "@pete_keen/courses/validators";
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
