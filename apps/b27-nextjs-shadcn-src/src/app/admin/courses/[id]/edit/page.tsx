import { courses } from "@/courses";
import { notFound } from "next/navigation";
import { CourseEditForm } from "@/lib/components/course-builder/course/course-edit-form";

export default async function CourseEditPage({
	params,
}: {
	params: { id: string };
}) {
	const course = await courses.course.outline(params.id);
	if (!course) return notFound();
	return <CourseEditForm course={course} />;
}
