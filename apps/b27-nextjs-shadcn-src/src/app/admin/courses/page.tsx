import { courses } from "@/courses";
import { CoursesTable } from "@/lib/components/courses-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CoursesPage() {
	const coursesList = await courses.course.list();

	return (
		<div className="space-y-4">
			<Button variant="default" size="sm" asChild>
				<Link
					href="/admin/courses/new"
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Course
				</Link>
			</Button>
			<CoursesTable courses={coursesList} />
		</div>
	);
}
