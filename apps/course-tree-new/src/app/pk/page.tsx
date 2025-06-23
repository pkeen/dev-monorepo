import { courses } from "@/courses";
import { CoursesForm } from "@/lib/courses-form";

export default async function PK() {
	const course = await courses.course.tree(1);
	console.log(course);
	return <CoursesForm course={course} />;
}
