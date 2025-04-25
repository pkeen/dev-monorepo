import { courses } from "@/courses";
import { CourseForm } from "@/lib/components/course-builder/course-form";

export default async function NewCoursePage() {
	return (
		<div className="space-y-4">
			<CourseForm />
		</div>
	);
}
