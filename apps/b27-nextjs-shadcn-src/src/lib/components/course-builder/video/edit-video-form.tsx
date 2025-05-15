"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateVideoDTO, createVideoDTO } from "@pete_keen/courses/validators";
import { ProviderComboBox } from "./provider-combo-box";
import { updateVideo } from "@/lib/actions/video/updateVideo";
import { Video } from "@pete_keen/courses/validators";
import { useState } from "react";
import { ConfirmDeleteVideoDialog } from "./confirm-delete-video-dialog";
import { deleteVideo } from "@/lib/actions/video/deleteVideo";
import { VideoUsage } from "@pete_keen/courses/types";

export function EditVideoForm({
	video,
	videoUsage,
}: {
	video: Video;
	videoUsage?: VideoUsage;
}) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const router = useRouter();
	const form = useForm<CreateVideoDTO>({
		resolver: zodResolver(createVideoDTO),
		defaultValues: {
			order: video.order,
			title: video.title,
			provider: video.provider,
			url: video.url,
			thumbnailUrl: video.thumbnailUrl,
		},
	});

	console.log(videoUsage);

	const onSubmit = async (data: CreateVideoDTO) => {
		try {
			await updateVideo({
				...data,
				id: video.id,
			});
			toast.success("Video updated!");
			router.push("/admin/courses/videos");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong updating the video.");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteVideo(video.id);
			toast.success("Video deleted!");
			router.push("/admin/courses/videos");
		} catch (err) {
			toast.error("Something went wrong deleting the video.");
			console.error(err);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<CardHeader>
					<CardTitle>Edit Video</CardTitle>
				</CardHeader>

				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Provider combio box to go here*/}
				<FormField
					control={form.control}
					name="provider"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Provider</FormLabel>
							<FormControl>
								<ProviderComboBox
									value={field.value}
									setValue={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input {...field} />
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
				<ConfirmDeleteVideoDialog
					open={openDeleteDialog}
					setOpen={setOpenDeleteDialog}
					onConfirm={() => {
						handleDelete();
					}}
					actionVerb="Delete"
					videoUsage={videoUsage}
				/>
			</form>
		</Form>
	);
}
