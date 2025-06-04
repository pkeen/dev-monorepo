import { courses } from "@/courses";
import { CoursesForm } from "@/lib/courses-form";

export default async function PK() {
	const course = await courses.course.tree(1);
	return <CoursesForm course={course} />;
}
