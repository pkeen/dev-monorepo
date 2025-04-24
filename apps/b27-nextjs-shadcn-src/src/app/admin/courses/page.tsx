import { courses } from "@/courses";
import { CoursesTable } from "@/lib/components/courses-table";

export default async function CoursesPage() {
	const coursesList = await courses.list();
	return <CoursesTable courses={coursesList} />;
}
