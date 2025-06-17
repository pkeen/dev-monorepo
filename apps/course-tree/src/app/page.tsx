// import { SortableTree } from "@/lib/SortableTree/SortableTree";
import { CourseEditForm } from "@pete_keen/courses-ui";
import { courses } from "@/courses";
import { CourseEditWrapper } from "./CourseEditWrapper";

export default async function Home() {
	const course = await courses.course.tree(1);
	const existingLessons = await courses.lesson.list();
	const existingModules = await courses.module.list();
	// const course = courses.course.display(1);
	// console.log(course);

	return (
		<>
			<CourseEditWrapper
				course={course}
				existingLessons={existingLessons}
				existingModules={existingModules}
			/>
		</>
	);
}
