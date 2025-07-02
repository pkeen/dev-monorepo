"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
// import { Switch } from "../../../ui/switch";
import { Button } from "../../../ui/button";
import { CardHeader, CardTitle } from "../../../ui/card";
import {
	lessonContentItem,
	LessonContentItem,
	// editLessonDTO,
	// Video,
} from "@pete_keen/courses-remake/validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
// import { editLesson } from "@/lib/actions/lesson/editLesson";
// import { deleteLesson } from "@/lib/actions/lesson/deleteLesson";
// import { ConfirmDeleteLessonDialog } from "./confirm-delete-lesson-dialog";
// import { LessonUsage } from "@pete_keen/courses/types";
import LessonEditor from "./LessonContentEditor";
import { VideoComboBox } from "./VideoComboBox";

// const lessonEditFormSchema = lessonDTO.extend({
// 	description: z.string().optional(),
// });

type Props = {
	lesson: LessonContentItem;
	updateLesson: (data: LessonContentItem) => Promise<void>;
	deleteContent: (id: number) => Promise<void>;
	// lessonUsage?: LessonUsage;
	// videos: Video[];
};

export const LessonEdit = ({ lesson, updateLesson, deleteContent }: Props) => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof lessonContentItem>>({
		resolver: zodResolver(lessonContentItem),
		defaultValues: {
			id: lesson.id,
			title: lesson.title,
			isPublished: lesson.isPublished ?? false,
			type: "lesson",
			details: {
				id: lesson.details.id,
				contentId: lesson.id,
				videoId: lesson.details.videoId,
				excerpt: lesson.details.excerpt,
				bodyContent: lesson.details.bodyContent ?? "",
			},
		},
	});

	const onSubmit = async (values: z.infer<typeof lessonContentItem>) => {
		try {
			await updateLesson(values);
			toast.success("Lesson updated!");
			form.reset(values);
			router.refresh(); // reload data if you're on the same page
		} catch (err) {
			toast.error("Something went wrong updating the lesson.");
			console.error(err);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteContent(lesson.id);
			toast.success("Lesson deleted!");
			router.push("/admin/courses");
		} catch (err) {
			toast.error("Something went wrong deleting the lesson.");
			console.error(err);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">Edit Lesson</CardTitle>
				</CardHeader>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.excerpt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Excerpt</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.videoId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Featured Video</FormLabel>
							<FormControl>
								<VideoComboBox
									value={field.value ?? null}
									setValue={field.onChange}
									videos={videos}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.bodyContent"
					render={() => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Controller
									control={form.control}
									name="details.bodyContent"
									render={({ field }) => (
										<LessonEditor
											value={field.value ?? ""}
											onChange={field.onChange}
										/>
									)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="mt-4 cursor-pointer"
					disabled={
						!form.formState.isDirty || form.formState.isSubmitting
					}
				>
					Save Lesson
				</Button>
				<Button
					type="button"
					variant="outline"
					className="ml-2 mt-4 cursor-pointer"
					onClick={() => {
						router.back();
					}}
				>
					Cancel
				</Button>
				<Button
					type="button"
					variant="destructive"
					className="ml-2 mt-4 cursor-pointer"
					onClick={() => {
						setOpenDeleteDialog(true);
					}}
				>
					Delete
				</Button>
				{/* <ConfirmDeleteLessonDialog
					open={openDeleteDialog}
					setOpen={setOpenDeleteDialog}
					onConfirm={() => {
						handleDelete();
					}}
					actionVerb="Delete"
					lessonUsage={lessonUsage}
				/> */}
			</form>
		</Form>
	);
};
