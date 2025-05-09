"use server";

import { courses } from "@/courses";

export async function getModuleUsage(moduleId: number) {
	const usage = await courses.module.findUsage(moduleId);
	return {
		inCourseSlots: usage.inCourseSlots.length,
		totalCount: usage.totalCount,
	};
}
