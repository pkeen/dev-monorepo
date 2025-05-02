"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { CourseSlot } from "./course-slot";
// import { moduleSchema, moduleOutlineSchema } from "../simple-schema";
import { moduleOutlineDTO, ModuleOutline } from "@pete_keen/courses/validators";
import { z } from "zod";
import { AddSlotDialog } from "./add-lesson-dialog";
import { Lesson } from "@pete_keen/courses/types";
import { useState, useTransition } from "react";
import { SelectExistingLessonDialog } from "./select-existing-lesson";
import { LessonSlotBlock } from "./lesson-slot-block";
import { SortableSlotList } from "./slot-list";
import { editModule } from "@/lib/actions/editModule";
import { toast } from "sonner";

// const existingLessons = [
// 	{
// 		id: 1,
// 		name: "Lesson 1",
// 		description: "Description 1",
// 		isPublished: false,
// 	},
// 	{
// 		id: 2,
// 		name: "Lesson 2",
// 		description: "Description 2",
// 		isPublished: false,
// 	},
// ];

export const ModuleEditForm = ({
	module,
	existingLessons,
}: {
	module: ModuleOutline;
	existingLessons: Lesson[];
}) => {
	const form = useForm({
		resolver: zodResolver(moduleOutlineDTO),
		defaultValues: {
			isPublished: module.isPublished,
			name: module.name,
			description: module.description ?? "",
			slots: module.slots,
			id: module.id,
		},
	});

	const { fields, append, remove, move, update } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const onSubmit = (values: z.infer<typeof moduleOutlineDTO>) => {
		startTransition(async () => {
			try {
				await editModule(values);
				toast.success("Module updated!");
				// router.refresh(); // reload data if you're on the same page
			} catch (err) {
				toast.error("Something went wrong updating the module.");
				console.error(err);
			}
		});
	};

	const [selectLessonOpen, setSelectLessonOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">Edit Module</CardTitle>
				</CardHeader>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter module name"
									{...field}
								/>
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
								<Input
									placeholder="Enter description"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Publish */}
				<FormField
					control={form.control}
					name="isPublished"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<FormLabel>Published Module</FormLabel>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Buttons to add top-level Modules or Lessons */}
				<Card className="p-4">
					<CardHeader>Module Content</CardHeader>
					<div className="flex gap-4">
						{/* Add Lesson */}
						<AddSlotDialog
							title="Add Lesson"
							trigger={
								<Button variant="outline">+ Add Lesson</Button>
							}
							onSelect={(choice) => {
								// This doesnt work for now we'll need to have a dialog and create a lesson in db
								if (choice === "new") {
									// append({
									// 	id: module.id,
									// 	moduleId: module.id,
									// 	lessonId: 0,
									// 	order: fields.length,
									// 	name: "",
									// });
									console.log("new");
								} else {
									setSelectLessonOpen(true);
									// Handle selecting existing lesson (show another modal or combobox)
								}
							}}
						/>
						<SelectExistingLessonDialog
							title="Select Existing Lesson"
							open={selectLessonOpen}
							onOpenChange={setSelectLessonOpen}
							items={existingLessons}
							onSelect={(item) => {
								append({
									id: 0,
									moduleId: module.id,
									lessonId: item.id,
									order: fields.length, // <-- Important: add at end
									lesson: {
										id: item.id,
										name: item.name,
										description: item.description ?? "",
										isPublished: item.isPublished ?? false,
									},
								});
								setSelectLessonOpen(false); // Close the dialog after selection
							}}
						/>
					</div>
					{/* Slots */}
					<SortableSlotList fields={fields} move={move} />
				</Card>

				<Button type="submit" className="mt-4 cursor-pointer">
					Save Module
				</Button>
			</form>
		</Form>
	);
};
