// import { SortableTree } from "@/lib/SortableTree/SortableTree";
import { CourseEditForm } from "@pete_keen/courses-ui";
import { courses } from "@/courses";
import { CourseEditWrapper } from "./CourseEditWrapper";
import { ContentItemDTO } from "@pete_keen/courses-core/validators";
import { updateCourseTree, deleteCourse } from "@/lib/actions";

export default async function Home() {
	const course = await courses.course.get(1);
	const existingContent: ContentItemDTO[] = await courses.content.list();
	// const course = courses.course.display(1);
	// console.log(course);

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
