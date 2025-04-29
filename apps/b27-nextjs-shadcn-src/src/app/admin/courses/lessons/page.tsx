import { courses } from "@/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { LessonTable } from "@/lib/components/course-builder/lessons/lesson-table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function LessonsPage() {
	const lessons = await courses.lesson.list();
	return (
		<ScrollArea className="flex">
			<div className="space-y-4">
				<Button variant="default" size="sm" asChild>
					<Link
						href="/admin/courses/lessons/new"
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Lesson
					</Link>
				</Button>
				<LessonTable lessons={lessons} />
			</div>
		</ScrollArea>
	);
}
