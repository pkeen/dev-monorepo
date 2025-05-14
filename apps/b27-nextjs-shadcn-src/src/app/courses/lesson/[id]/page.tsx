import { courses } from "@/courses";
import { DisplayMarkdown } from "@/lib/components/course-display/display-markdown";
import { LessonView } from "@/lib/components/course-display/lesson-view";

export default async function LessonPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const lesson = await courses.lesson.get(parseInt(id));
	const video = await courses.video.get(lesson?.videoId);

	const lessonView = {
		...lesson,
		video: {
			provider: video?.provider,
			url: video?.url,
		},
	};
	return (
		<div>
			{/* <h1>{lesson?.name}</h1> */}
			<LessonView lesson={lessonView} />
		</div>
	);
}
