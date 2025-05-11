"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import {
	uiModuleCreateDTO,
	UiModuleCreate,
	Lesson,
} from "@pete_keen/courses/validators";

import { createModule } from "@/lib/actions/module/createModule";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { SortableSlotList } from "./module-slot-list";
import { ModuleDetailFields } from "./module-form-fields";
import { AddSlotDialog } from "./add-lesson-dialog";
import { SelectExistingDialog } from "../course/select-existing";
import { useState } from "react";

export const NewModuleForm = ({
	existingLessons,
}: {
	existingLessons: Lesson[];
}) => {
	const form = useForm({
		resolver: zodResolver(uiModuleCreateDTO),
		defaultValues: {
			isPublished: false,
			name: "",
			description: "",
			slots: [],
		},
	});

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const [selectLessonOpen, setSelectLessonOpen] = useState(false);

	const router = useRouter();

	const onSubmit = async (values: UiModuleCreate) => {
		try {
			const module = await createModule(values);
			console.log(module);
			toast.success("Module created successfully.");
			router.push(`/admin/courses/modules/${module.id}/edit`);
		} catch (error) {
			toast.error("Something went wrong creating the module.");
			console.error(error);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(
					(values) => {
						console.log("✅ onSubmit values:", values);
						onSubmit(values);
					},
					(errors) => {
						console.log("❌ validation errors:", errors);
					}
				)}
				className="space-y-4"
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">New Module</CardTitle>
				</CardHeader>

				{/* <ModuleDetailFields form={form} /> */}

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
								<Textarea
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
						<SelectExistingDialog
							title="Select Existing Lesson"
							open={selectLessonOpen}
							onOpenChange={setSelectLessonOpen}
							items={existingLessons}
							onSelect={(item) => {
								append({
									clientId: `new-${fields.length}`,
									lessonId: item.id,
									order: fields.length, // <-- Important: add at end
									content: {
										name: item.name,
										isPublished: item.isPublished ?? false,
									},
								});
								setSelectLessonOpen(false); // Close the dialog after selection
							}}
						/>
					</div>
					<SortableSlotList fields={fields} move={move} />
				</Card>

				<Button type="submit">Save Module</Button>
			</form>
		</Form>
	);
};
