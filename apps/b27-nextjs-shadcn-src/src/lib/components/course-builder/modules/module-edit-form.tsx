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
import { moduleSchema } from "../simple-schema";
import { z } from "zod";
import { AddSlotDialog } from "./add-lesson-dialog";
import { Module } from "@pete_keen/courses/types";

export const ModuleEditForm = ({ module }: { module: Module }) => {
	const form = useForm<z.infer<typeof moduleSchema>>({
		resolver: zodResolver(moduleSchema),
		defaultValues: {
			isPublished: module.isPublished,
			name: module.name,
			description: module.description ?? "",
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const onSubmit = (values: z.infer<typeof moduleSchema>) => {
		console.log(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">New Module</CardTitle>
				</CardHeader>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Module Name</FormLabel>
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
							<FormLabel>Module Description</FormLabel>
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
								if (choice === "new") {
									append({
										moduleId: form.getValues("id"),
									});
								} else {
									// Handle selecting existing lesson (show another modal or combobox)
								}
							}}
						/>
					</div>
				</Card>

				{/* Slots */}
				{
					<div className="space-y-4">
						{fields.map((field, index) => (
							<p key={index}>{field.id}</p>
						))}
					</div>
				}
			</form>
		</Form>
	);
};
