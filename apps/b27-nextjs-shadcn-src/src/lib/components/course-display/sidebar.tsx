import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleSlot, CourseSlotOutline } from "@pete_keen/courses/validators";

export function Sidebar({
	slots,
	currentLessonId,
}: {
	slots: CourseSlotOutline[];
	currentLessonId: number;
}) {
	return (
		<ScrollArea className="bg-muted p-4">
			{slots.map((slot) => (
				<div key={slot.id}>
					<h2 className="text-lg font-semibold">
						{slot.content.name}
					</h2>
					{/* <ul>
						{slot.content.name.map((lesson) => (
							<li
								key={lesson.id}
								className={`text-sm pl-4 py-1 ${
									lesson.id === currentLessonId
										? "font-bold"
										: ""
								}`}
							>
								<a
									href={`/course/${slot.courseId}/${lesson.id}`}
								>
									{lesson.title}
								</a>
							</li>
						))}
					</ul> */}
				</div>
			))}
		</ScrollArea>
	);
}
