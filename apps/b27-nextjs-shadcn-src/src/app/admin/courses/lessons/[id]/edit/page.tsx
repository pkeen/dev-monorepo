import { courses } from "@/courses";
import { LessonEditForm } from "@/lib/components/course-builder/lessons/lesson-edit-form";

export default async function LessonEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const lesson = await courses.lesson.get(parseInt(id));
	return lesson ? (
		<LessonEditForm lesson={lesson} />
	) : (
		<div>Lesson not found</div>
	);
}
