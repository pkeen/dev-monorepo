"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createLessonDTO } from "@pete_keen/courses/validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createLesson } from "@/lib/actions/lesson/createLesson";

export const LessonNewForm = () => {
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(createLessonDTO),
		defaultValues: {
			name: "",
			description: "",
			isPublished: false,
		},
	});

	const onSubmit = async (values: z.infer<typeof createLessonDTO>) => {
		try {
			const lesson = await createLesson(values);
			toast.success("Lesson created!");
			form.reset(values);
			router.push(`/admin/courses/lessons/${lesson.id}/edit`);
		} catch (err) {
			toast.error("Something went wrong creating the lesson.");
			console.error(err);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">New Lesson</CardTitle>
				</CardHeader>
				<FormField
					control={form.control}
					name="name"
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="isPublished"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<FormLabel>Published Lesson</FormLabel>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
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
					Create Lesson
				</Button>
			</form>
		</Form>
	);
};
