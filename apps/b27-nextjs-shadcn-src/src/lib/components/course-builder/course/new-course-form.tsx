"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { createCourse } from "@/lib/actions/course/createCourse";
import { Lesson, UiCourseCreate } from "@pete_keen/courses/validators";
import {
	Form,
	FormLabel,
	FormMessage,
	FormItem,
	FormControl,
	FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uiCourseCreateDTO } from "@pete_keen/courses/validators";
import { SortableSlotList } from "./slot-list";
import { Switch } from "@radix-ui/react-switch";
import { AddSlotDialog } from "./add-slot-dialog";
import { SelectExistingDialog } from "./select-existing";
import Module from "module";

export function NewCourseForm({
	userId,
	existingLessons,
	existingModules,
}: {
	userId: string;
	existingLessons: Lesson[];
	existingModules: Module[];
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [selectLessonOpen, setSelectLessonOpen] = useState(false);
	const [selectModuleOpen, setSelectModuleOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(uiCourseCreateDTO),
		defaultValues: {
			userId,
			slots: [],
			isPublished: false,
			title: "",
			description: "",
		},
	});

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const onSubmit = async (values: UiCourseCreate) => {
		startTransition(async () => {
			try {
				const course = await createCourse(values);
				toast.success("Course created successfully");
				router.push(`/admin/courses/${course.id}/edit`);
			} catch (err) {
				toast.error("Something went wrong creating the course.");
				console.error(err);
			}
		});
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
							<AddSlotDialog
								trigger={
									<Button type="button" variant="outline">
										+ Add Module
									</Button>
								}
								title="Add Module"
								onSelect={(choice) => {
									if (choice === "new") {
										console.log("new");
									} else {
										setSelectModuleOpen(true);
									}
								}}
							/>
							<SelectExistingDialog
								title="Select Existing Module"
								open={selectModuleOpen}
								onOpenChange={setSelectModuleOpen}
								items={existingModules}
								onSelect={(item) => {
									append({
										clientId: `new-${fields.length}`,
										moduleId: item.id,
										lessonId: null,
										order: fields.length, // <-- Important: add at end
										content: {
											name: item.name,
											isPublished: item.isPublished,
										},
									});
									setSelectModuleOpen(false); // Close the dialog after selection
								}}
							/>
							<AddSlotDialog
								trigger={
									<Button type="button" variant="outline">
										+ Add Lesson
									</Button>
								}
								title="Add Lesson"
								onSelect={(choice) => {
									if (choice === "new") {
										console.log("new");
									} else {
										setSelectLessonOpen(true);
									}
								}}
							/>
							<SelectExistingDialog
								title="Select Existing Lesson"
								open={selectLessonOpen}
								onOpenChange={setSelectLessonOpen}
								items={existingLessons}
								onSelect={(item) => {
									append({
										clientId: `new-${fields.length}`,
										order: fields.length, // <-- Important: add at end
										lessonId: item.id,
										moduleId: null,
										content: {
											name: item.name,
											isPublished: item.isPublished,
										},
									});
									setSelectLessonOpen(false); // Close the dialog after selection
								}}
							/>
						</div>
						<SortableSlotList fields={fields} move={move} />
					</Card>

					<Button
						type="submit"
						disabled={isPending || !form.formState.isDirty}
					>
						Save Course
					</Button>
					<Button
						type="button"
						variant="outline"
						className="ml-2 mt-4 cursor-pointer"
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</form>
			</Form>
		</div>
	);
}
