import { courses } from "@/courses";
import { DisplayMarkdown } from "@/lib/components/course-display/display-markdown";
import { LessonView } from "@/lib/components/course-display/lesson-view";
import { notFound } from "next/navigation";

export default async function LessonPage({
	params,
}: {
	params: { id: string; lessonId: string };
}) {
	const { id, lessonId } = await params;
	const lesson = await courses.lesson.get(parseInt(lessonId));
	console.log("lesson", lesson);
	if (!lesson) return notFound();
	const video = await courses.video.get(lesson?.videoId);

	const lessonView = {
		...lesson,
		video: {
			provider: video?.provider,
			url: video?.url,
		},
	};
	return (
		<div className="lesson-content">
			<h1>{lesson.name}</h1>
			<LessonView lesson={lessonView} />
		</div>
	);
}
