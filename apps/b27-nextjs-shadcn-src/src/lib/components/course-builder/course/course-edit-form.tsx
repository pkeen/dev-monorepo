"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	uiCourseDTO,
	UiCourse,
	Lesson,
	Module,
} from "@pete_keen/courses/validators";
// import { courseSchema, CourseFormValues } from "./schema"; // we'll store schema separately
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
import { AddSlotDialog } from "./add-slot-dialog";
import { SelectExistingDialog } from "./select-existing";
import { useMemo, useState } from "react";
import { SortableSlotList } from "./slot-list";
import { editCourse } from "@/lib/actions/course/editCourse";
import { toast } from "sonner";
import { useTransition } from "react";

export function withClientIds(course: UiCourse): UiCourse {
	return {
		...course,
		slots: course.slots.map((slot, i) => ({
			...slot,
			clientId:
				slot.clientId ?? (slot.id ? `slot-${slot.id}` : `new-${i}`),
		})),
	};
}

export function CourseEditForm({
	course,
	existingLessons,
	existingModules,
}: {
	course: UiCourse;
	existingLessons: Lesson[];
	existingModules: Module[];
}) {
	// 🟣 1. Build a *stable* clientId without randomness
	const defaultValues = useMemo(() => withClientIds(course), [course]);

	const [selectLessonOpen, setSelectLessonOpen] = useState(false);
	const [selectModuleOpen, setSelectModuleOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm({
		resolver: zodResolver(uiCourseDTO),
		defaultValues,
	});

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const onSubmit = (values: UiCourse) => {
		console.log(values);
		startTransition(async () => {
			try {
				const course = await editCourse(values);
				toast.success("Course updated!");
				form.reset(withClientIds(course));
				// router.refresh(); // reload data if you're on the same page
			} catch (err) {
				toast.error("Something went wrong updating the course.");
				console.error(err);
			}
		});
	};

	return (
		<div>
			<Form {...form}>
				<form
					// onSubmit={form.handleSubmit(onSubmit)}
					onSubmit={form.handleSubmit(onSubmit, (errors) =>
						console.log("❌ validation errors", errors)
					)}
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
										id: undefined,
										clientId: `new-${fields.length}`,
										courseId: course.id,
										moduleId: item.id,
										order: fields.length, // <-- Important: add at end
										content: {
											id: item.id,
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
										id: undefined,
										clientId: `new-${fields.length}`,
										courseId: course.id,
										order: fields.length, // <-- Important: add at end
										lessonId: item.id,
										content: {
											id: item.id,
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
				</form>
			</Form>
		</div>
	);
}
