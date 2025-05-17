"use client";

import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	ModuleSlot,
	CourseSlotDeepOutline,
} from "@pete_keen/courses/validators";
import Link from "next/link";
import {
	LayoutDashboard,
	Users,
	BookOpen,
	Settings,
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const SidebarLesson = ({
	lesson,
	courseId,
	currentLessonId,
}: {
	lesson: {
		id: number;
		order: number;
		content: {
			id: number;
			name: string;
			isPublished?: boolean;
		};
	};
	currentLessonId: number | undefined;
	courseId: number;
}) => {
	return (
		<Link key={lesson.id} href={`/course/${courseId}/${lesson.content.id}`}>
			<Button
				variant={
					lesson.content.id === currentLessonId ? "default" : "ghost"
				}
				className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium cursor-pointer"
			>
				{lesson.content.name}
			</Button>
		</Link>
	);
};

export function Sidebar({ slots }: { slots: CourseSlotDeepOutline[] }) {
	const { lessonId } = useParams();

	return (
		<ScrollArea className="bg-muted p-4">
			<nav className="space-y-1">
				<Accordion type="multiple" className="w-full">
					{slots.map((slot) =>
						slot.content.type === "module" ? (
							<AccordionItem
								key={slot.id}
								value={slot.id.toString()}
							>
								<AccordionTrigger className="w-full px-3 py-2 text-sm font-medium flex justify-start gap-2 cursor-pointer">
									{slot.content.name}
								</AccordionTrigger>
								<AccordionContent className="pl-8 flex flex-col">
									{slot.content.slots.map((lesson) => (
										<SidebarLesson
											lesson={lesson}
											currentLessonId={
												lessonId
													? parseInt(
															lessonId as string
													  )
													: undefined
											}
											courseId={slot.courseId}
											key={lesson.id}
										/>
										// // <Link
										// // 	key={lesson.id}
										// // 	href={`/course/${slot.courseId}/${lesson.id}`}
										// // >
										// // 	<Button
										// // 		variant="ghost"
										// 		className="w-full justify-start gap-2 px-3 py-2 text-sm font-normal cursor-pointer"
										// 	>
										// 		{lesson.content.name}
										// 	</Button>
										// </Link>
									))}
								</AccordionContent>
							</AccordionItem>
						) : (
							<SidebarLesson
								lesson={slot}
								currentLessonId={
									lessonId
										? parseInt(lessonId as string)
										: undefined
								}
								courseId={slot.courseId}
								key={slot.id}
							/>
							// <Link
							// 	key={slot.id}
							// 	href={`/course/${slot.courseId}/${slot.id}`}
							// >
							// 	<Button
							// 		variant="ghost"
							// 		className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium cursor-pointer"
							// 	>
							// 		{slot.content.name}
							// 	</Button>
							// </Link>
						)
					)}
				</Accordion>
			</nav>
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
		</ScrollArea>
	);
}
