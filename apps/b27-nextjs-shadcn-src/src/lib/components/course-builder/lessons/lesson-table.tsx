"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // import the Input component
import { MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { Lesson } from "@pete_keen/courses/types";
import { DeleteDialog } from "../utils/delete-dialog";
import { deleteLesson } from "@/lib/actions/lesson/deleteLesson";
import { toast } from "sonner";
import { getLessonUsage } from "./lesson-find-usage";

export function LessonTable({ lessons }: { lessons: Lesson[] }) {
	const [allLessons, setAllLessons] = useState(lessons);
	const [search, setSearch] = useState("");
	// const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
	const [lessonUsage, setLessonUsage] = useState<{
		inCourseSlots: number;
		inModuleSlots: number;
		total: number;
	} | null>(null);
	console.log("lessonUsage", lessonUsage);

	console.log("lessonToDelete", lessonToDelete);

	const filteredLessons = allLessons.filter((lesson) =>
		`${lesson.name} ${lesson.description}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);

	const handleDelete = async (lessonId: number) => {
		if (!lessonToDelete) return;
		try {
			await deleteLesson(lessonId);
			setAllLessons((prev) => prev.filter((l) => l.id !== lessonId));
			setLessonToDelete(null);
			toast.success("Lesson deleted!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong deleting the lesson.");
		}
	};
	return (
		<div className="space-y-4">
			<DeleteDialog
				title="Delete Lesson"
				description={`Are you sure you want to delete this lesson?`}
				children={
					lessonUsage &&
					lessonUsage.total > 0 && (
						<div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded mb-4">
							This lesson is used in {lessonUsage.inCourseSlots}{" "}
							course slot
							{lessonUsage.inCourseSlots !== 1
								? "s"
								: ""} and {lessonUsage.inModuleSlots} module
							slot
							{lessonUsage.inModuleSlots !== 1 ? "s" : ""}.
							Deleting it will remove it from those slots.
						</div>
					)
				}
				onDelete={() => handleDelete(lessonToDelete?.id)}
				open={!!lessonToDelete}
				setOpen={(open) => {
					if (!open) setLessonToDelete(null);
				}}
			/>
			<Input
				placeholder="Search courses..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Title</TableHead>
						<TableHead className="text-left">Description</TableHead>
						<TableHead className="text-left">Published</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredLessons.map((lesson) => (
						<TableRow key={lesson.id}>
							<TableCell>{lesson.name}</TableCell>
							<TableCell>
								{lesson.description
									? lesson.description?.substring(0, 50) +
									  "..."
									: ""}
							</TableCell>
							<TableCell>
								{lesson.isPublished ? "Yes ✅" : "No ❌"}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="cursor-pointer"
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem asChild>
											<Link
												href={`/admin/courses/lessons/${lesson.id}/edit`}
												className="cursor-pointer"
											>
												Edit
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600 cursor-pointer"
											onClick={async () => {
												setLessonUsage(null);
												setLessonToDelete(lesson);
												const usage =
													await getLessonUsage(
														lesson.id
													);
												setLessonUsage(usage);
											}}
										>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
