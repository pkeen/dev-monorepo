"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormValues } from "./schema"; // we'll store schema separately
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
import { Card, CardHeader } from "@/components/ui/card";
import { CourseSlot } from "./course-slot";

export function CourseForm() {
	const form = useForm<CourseFormValues>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			title: "",
			description: "",
			isPublished: false,
			slots: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const onSubmit = (values: CourseFormValues) => {
		console.log(values);
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<Card className="p-6 space-y-4">
						<CardHeader>Course Information</CardHeader>
						{/* Course Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter course title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Course Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Description</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter course description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Course Publish */}
						<FormField
							control={form.control}
							name="isPublished"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<FormLabel>Publish Course</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</Card>

					{/* Buttons to add top-level Modules or Lessons */}
					<Card className="p-4">
						<CardHeader>Course Content</CardHeader>
						<div className="flex gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									append({
										id: crypto.randomUUID(),
										type: "module",
										data: {
											name: "",
											description: "",
											isPublished: false,
											slots: [],
										},
									})
								}
							>
								+ Add Module
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									append({
										id: crypto.randomUUID(),
										type: "lesson",
										data: {
											name: "",
											description: "",
											isPublished: false,
										},
									})
								}
							>
								+ Add Lesson
							</Button>
						</div>

						{/* Slots */}
						<div className="space-y-4">
							{fields.map((field, index) => (
								<CourseSlot
									key={field.id}
									nestIndex={index}
									nestPath={`slots.${index}`}
									control={form.control}
									remove={() => remove(index)}
								/>
							))}
						</div>
					</Card>

					<Button type="submit">Save Course</Button>
				</form>
			</Form>
		</div>
	);
}
