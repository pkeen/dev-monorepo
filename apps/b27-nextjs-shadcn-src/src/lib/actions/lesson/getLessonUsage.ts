// app/actions/getLessonUsage.ts
"use server";

import { courses } from "@/courses";

export async function getLessonUsage(lessonId: number) {
	const usage = await courses.lesson.findUsage(lessonId);
	return {
		inCourseSlots: usage.inCourseSlots,
		inModuleSlots: usage.inModuleSlots,
		totalCount: usage.totalCount,
	};
}
