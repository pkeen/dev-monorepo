import { courses } from "@/courses";
import { CourseEditWrapper } from "../CourseEditWrapper";
import { updateCourseTree, deleteCourse } from "@/lib/actions";

export default async function Page({
	params,
}: {
	params: { courseId: string };
}) {
	const course = await courses.course.get(parseInt(params.courseId, 10));
	const existingContent = await courses.content.list();

	return (
		<>
			<CourseEditWrapper
				course={course}
				existingContent={existingContent}
				onSubmit={updateCourseTree}
				onDelete={deleteCourse}
			/>
		</>
	);
}
