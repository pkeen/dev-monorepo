import { courses } from "@/courses";
import { CoursesForm } from "./course-form-test";

export default async function () {
	const course = await courses.course.tree(1);
	return <CoursesForm course={course} />;
}
