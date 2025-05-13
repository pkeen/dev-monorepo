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
// import { Lesson, LessonUsage } from "@pete_keen/courses/types";
import { Video } from "@pete_keen/courses/validators";
// import { deleteLesson } from "@/lib/actions/lesson/deleteLesson";
import { toast } from "sonner";
// import { getLessonUsage } from "../../../actions/lesson/getLessonUsage";
// import { ConfirmDeleteLessonDialog } from "./confirm-delete-lesson-dialog";

export function VideoTable({ videos }: { videos: Video[] }) {
	const [allVideos, setAllVideos] = useState(videos);
	const [search, setSearch] = useState("");
	// const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
	// const [videoUsage, setVideoUsage] = useState<VideoUsage | null>(null);

	const filteredVideos = allVideos.filter((video) =>
		`${video.title}`.toLowerCase().includes(search.toLowerCase())
	);

	// const handleDelete = async (videoId: number) => {
	// 	if (!videoToDelete) return;
	// 	try {
	// 		await deleteVideo(videoId);
	// 		setAllVideos((prev) => prev.filter((v) => v.id !== videoId));
	// 		setVideoToDelete(null);
	// 		toast.success("Lesson deleted!");
	// 	} catch (err) {
	// 		console.error(err);
	// 		toast.error("Something went wrong deleting the lesson.");
	// 	}
	// };
	return (
		<div className="space-y-4">
			{/* <ConfirmDeleteLessonDialog
				onConfirm={() => handleDelete(lessonToDelete?.id)}
				open={!!lessonToDelete}
				setOpen={(open) => {
					if (!open) setLessonToDelete(null);
				}}
				actionVerb="Delete"
				lessonUsage={lessonUsage ?? undefined}
			/> */}
			<Input
				placeholder="Search videos..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Title</TableHead>
						<TableHead className="text-left">Provider</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredVideos.map((video) => (
						<TableRow key={video.id}>
							<TableCell>{video.title}</TableCell>
							<TableCell>{video.provider}</TableCell>
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
												href={`/admin/courses/videos/${video.id}/edit`}
												className="cursor-pointer"
											>
												Edit
											</Link>
										</DropdownMenuItem>
										{/* <DropdownMenuItem
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
										</DropdownMenuItem> */}
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
