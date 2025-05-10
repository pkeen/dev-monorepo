import { courses } from "@/courses";
import { NewCourseForm } from "@/lib/components/course-builder/course/new-course-form";

export default async function NewCoursePage() {
	const existingLessons = await courses.lesson.list();
	const existingModules = await courses.module.list();
	return (
		<div className="space-y-4">
			<NewCourseForm
				existingLessons={existingLessons}
				existingModules={existingModules}
			/>
		</div>
	);
}
