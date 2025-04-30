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
import { moduleSchema, moduleOutlineSchema } from "../simple-schema";
import { z } from "zod";
import { AddSlotDialog } from "./add-lesson-dialog";
import { ModuleOutline } from "@pete_keen/courses/types";
import { useState } from "react";
import { SelectExistingLessonDialog } from "./select-existing-lesson";
import { LessonSlotBlock } from "./lesson-slot-block";

const existingLessons = [
	{
		id: 1,
		name: "Lesson 1",
		description: "Description 1",
		isPublished: false,
	},
	{
		id: 2,
		name: "Lesson 2",
		description: "Description 2",
		isPublished: false,
	},
];

export const ModuleEditForm = ({ module }: { module: ModuleOutline }) => {
	const form = useForm<z.infer<typeof moduleOutlineSchema>>({
		resolver: zodResolver(moduleOutlineSchema),
		defaultValues: {
			isPublished: module.isPublished,
			name: module.name,
			description: module.description ?? "",
			lessonSlots: module.lessonSlots ?? [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "lessonSlots",
	});

	const onSubmit = (values: z.infer<typeof moduleSchema>) => {
		console.log(values);
	};

	const [selectLessonOpen, setSelectLessonOpen] = useState(false);

	console.log("selectLessonOpen", selectLessonOpen);

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
									append({
										id: module.id,
										moduleId: module.id,
										lessonId: 0,
										order: fields.length,
										name: "",
									});
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
									id: module.id,
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
					{
						<div className="space-y-4">
							{[...fields]
								.sort((a, b) => a.order - b.order) // <-- Sort by order before rendering
								.map((field, index) => (
									<LessonSlotBlock
										key={field.lesson.id}
										title={
											field.lesson.name
												? `${index + 1}. ${
														field.lesson.name
												  }`
												: `Lesson ${index + 1}`
										}
										onClick={() => {
											/* open edit modal */
										}}
									/>
								))}
						</div>
					}
				</Card>

				<Button type="submit">Save Module</Button>
			</form>
		</Form>
	);
};
