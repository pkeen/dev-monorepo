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
import { createVideo } from "@/lib/actions/video/createVideo";

export function NewVideoForm() {
	const router = useRouter();
	const form = useForm<CreateVideoDTO>({
		resolver: zodResolver(createVideoDTO),
		defaultValues: {
			order: 0,
			title: "",
			provider: "youtube",
			url: "",
			thumbnailUrl: "",
		},
	});

	const onSubmit = async (data: CreateVideoDTO) => {
		try {
			await createVideo(data);
			toast.success("Video created!");
			router.push("/admin/courses/videos");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong creating the video.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<CardHeader>
					<CardTitle>New Video</CardTitle>
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
					Create Video
				</Button>
			</form>
		</Form>
	);
}
