import { courses } from "@/courses";
import { notFound } from "next/navigation";
// import { CourseEditForm } from "@/lib/components/course-builder/course/course-edit-form";
import { CourseEditForm } from "@/lib/components/course-builder/course/course-edit-form-nested";

export default async function CourseEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const course = await courses.course.deep(parseInt(id, 10));
	const existingModules = await courses.module.list();
	const existingLessons = await courses.lesson.list();
	if (!course) return notFound();
	return (
		<CourseEditForm
			course={course}
			existingLessons={existingLessons}
			existingModules={existingModules}
		/>
	);
}
