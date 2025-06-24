"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Lesson,
	ModuleDTO,
	CourseDisplay,
	EditCourseTreeDTO,
	UiCourseDisplay,
	uiCourseDisplay,
	editCourseTreeDTO,
	ModuleTreeDTO,
} from "@pete_keen/courses/validators";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import { AddSlotDialog } from "./add-slot-dialog";
import { useMemo, useState } from "react";
// import { NestedSortableSlotList } from "./nested-slot-list-display";
// import { editCourse } from "@/lib/actions/course/editCourse";
// import { deleteCourse } from "@/lib/actions/course/deleteCourse";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteCourseDialog } from "./confirm-delete-course";
import { SelectExistingModule } from "./select-existing-module";
import { SelectExistingLesson } from "./select-existing-lesson";
import { SortableTree } from "./SortableTreeOld";
import { Controller } from "react-hook-form";
// import { courseDisplayToUi } from "./course-display-to-ui";

export function CourseEditForm({
	course,
	existingLessons,
	existingModules,
	onSubmit,
	onDelete,
	fetchModuleTree,
}: {
	course: EditCourseTreeDTO;
	existingLessons: Lesson[];
	existingModules: ModuleDTO[];
	onSubmit: (values: EditCourseTreeDTO) => Promise<EditCourseTreeDTO>;
	onDelete: (id: number) => Promise<void>;
	fetchModuleTree: (moduleId: number) => Promise<ModuleTreeDTO | null>;
}) {
	const form = useForm({
		resolver: zodResolver(editCourseTreeDTO),
		defaultValues: course,
	});
	// 🟣 1. Build a *stable* clientId without randomness
	// const defaultValues = useMemo(() => courseDisplayToUi(course), [course]);
	// console.log("Form values:", form.getValues());

	const [selectLessonOpen, setSelectLessonOpen] = useState(false);
	const [selectModuleOpen, setSelectModuleOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "items",
		keyName: "fieldId", // anything except “id”
	});

	const handleSubmit = (values: EditCourseTreeDTO) => {
		console.log(values);
		startTransition(async () => {
			try {
				const course = await onSubmit(values);
				toast.success("Course updated!");
				form.reset(course);
				// router.refresh(); // reload data if you're on the same page
			} catch (err) {
				toast.error("Something went wrong updating the course.");
				console.error(err);
			}
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			try {
				await onDelete(course.id);
				toast.success("Course deleted!");
				router.push("/admin/courses");
			} catch (err) {
				toast.error("Something went wrong deleting the course.");
				console.error(err);
			}
		});
	};

	return (
		<div>
			<Form {...form}>
				<form
					// onSubmit={form.handleSubmit(onSubmit)}
					onSubmit={form.handleSubmit(handleSubmit, (errors) =>
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
							<SelectExistingModule
								title="Select Existing Module"
								open={selectModuleOpen}
								onOpenChange={setSelectModuleOpen}
								items={existingModules}
								onSelect={async (item) => {
									const moduleTree = await fetchModuleTree(
										item.id
									);
									if (!moduleTree) return;
									// get moduletree action
									append({
										id: undefined,
										clientId: `new-${fields.length}`,
										courseId: course.id,
										moduleId: moduleTree.id,
										lessonId: null,
										order: fields.length,
										name: moduleTree.name,
										isPublished:
											moduleTree.isPublished ?? false,
										type: "module",
										children: moduleTree.items.map(
											(item, i) => ({
												...item,
												clientId: `new-${fields.length}-${i}`,
											})
										),
									});

									setSelectModuleOpen(false);
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
							<SelectExistingLesson
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
										moduleId: null,
										name: item.name,
										type: "lesson",
										isPublished: item.isPublished,
										children: [],
									});
									setSelectLessonOpen(false); // Close the dialog after selection
								}}
							/>
						</div>
						<Controller
							control={form.control}
							name="items"
							render={({ field }) => (
								<SortableTree
									items={field.value ?? []}
									onChange={field.onChange}
									indicator={true}
									removable={true}
									collapsible={true}
									indentationWidth={50}
								/>
							)}
						/>
						{/* <NestedSortableSlotList fields={fields} move={move} /> */}
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
					<Button
						type="button"
						variant="destructive"
						className="ml-2 mt-4 cursor-pointer"
						onClick={() => setOpenDeleteDialog(true)}
					>
						Delete Course
					</Button>
					<ConfirmDeleteCourseDialog
						open={openDeleteDialog}
						setOpen={setOpenDeleteDialog}
						onConfirm={handleDelete}
					/>
				</form>
			</Form>
		</div>
	);
}
