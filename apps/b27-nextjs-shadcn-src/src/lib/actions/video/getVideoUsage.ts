// app/actions/getLessonUsage.ts
"use server";

import { courses } from "@/courses";

export async function getVideoUsage(videoId: number) {
	const usage = await courses.video.findUsage(videoId);
	return {
		inLessons: usage.inLessons,
		totalCount: usage.totalCount,
	};
}
