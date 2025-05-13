import { courses } from "@/courses";
import { DisplayMarkdown } from "@/lib/components/course-display/display-markdown";

export default async function LessonPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const lesson = await courses.lesson.get(parseInt(id));
	return (
		<div>
			<h1>{lesson?.name}</h1>
			<DisplayMarkdown content={lesson?.content ?? ""} />
		</div>
	);
}
