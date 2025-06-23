// import { SortableTree } from "@/lib/SortableTree/SortableTree";
import { CourseEditForm } from "@pete_keen/courses-ui";
import { courses } from "@/courses";
import { CourseEditWrapper } from "./CourseEditWrapper";

export default async function Home() {
	const course = await courses.course.get(1);
	const existingLessons: LessonDetail[] = [];
	const existingModules: ModuleDetail[] = [];
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
