"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Lesson,
	Module,
	CourseDeepDisplay,
	UiCourseDeep,
	uiCourseDeep,
	CourseDisplay,
	UiCourseDisplay,
	uiCourseDisplay,
} from "@pete_keen/courses/validators";
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
import { useMemo, useState } from "react";
import { NestedSortableSlotList } from "./nested-slot-list-display";
import { editCourse } from "@/lib/actions/course/editCourse";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/lib/actions/course/deleteCourse";
import { ConfirmDeleteCourseDialog } from "./confirm-delete-course";
import { SelectExistingModule } from "../utils/select-existing-module";
import { SelectExistingLesson } from "../utils/select-existing-lesson";
import { courseDisplayToUi } from "./course-display-to-ui";

// export function withClientIds(course: CourseDeepDisplay): UiCourseDeep {
// 	return {
// 		...course,
// 		slots: course.slots.map((slot, i) => {
// 			const topLevelClientId = slot.id
// 				? `slot-${slot.id}`
// 				: `new-slot-${i}`;

// 			if (slot.content.type === "lesson") {
// 				// Top-level lesson
// 				return {
// 					...slot,
// 					clientId: topLevelClientId,
// 					content: {
// 						...slot.content,
// 					},
// 				};
// 			} else {
// 				// Module with nested lesson slots
// 				const enrichedModule = {
// 					...slot.content,
// 					moduleSlots: slot.content.moduleSlots.map(
// 						(lessonSlot, j) => ({
// 							...lessonSlot,
// 							clientId: lessonSlot.id
// 								? `lesson-${lessonSlot.id}`
// 								: `new-lesson-${i}-${j}`,
// 							content: {
// 								...lessonSlot.content,
// 							},
// 						})
// 					),
// 				};

// 				return {
// 					...slot,
// 					clientId: topLevelClientId,
// 					content: enrichedModule,
// 				};
// 			}
// 		}),
// 	};
// }

export function CourseEditForm({
	course,
	existingLessons,
	existingModules,
}: {
	course: CourseDisplay;
	existingLessons: Lesson[];
	existingModules: Module[];
}) {
	// 🟣 1. Build a *stable* clientId without randomness
	const defaultValues = useMemo(() => courseDisplayToUi(course), [course]);
	console.log("Form values:", defaultValues);

	const [selectLessonOpen, setSelectLessonOpen] = useState(false);
	const [selectModuleOpen, setSelectModuleOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const form = useForm<UiCourseDisplay>({
		resolver: zodResolver(uiCourseDisplay),
		defaultValues,
	});

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const onSubmit = (values: UiCourseDisplay) => {
		console.log(values);
		startTransition(async () => {
			try {
				const course = await editCourse(values);
				toast.success("Course updated!");
				form.reset(courseDisplayToUi(course));
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
				await deleteCourse(course.id);
				toast.success("Course deleted!");
				router.push("/admin/courses");
			} catch (err) {
				toast.error("Something went wrong deleting the course.");
				console.error(err);
			}
		});
	};

	console.log("Form values:", form.getValues());

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
							<SelectExistingModule
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
										lessonId: null,
										order: fields.length, // <-- Important: add at end
										display: {
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
										display: {
											name: item.name,
											isPublished: item.isPublished,
										},
									});
									setSelectLessonOpen(false); // Close the dialog after selection
								}}
							/>
						</div>
						<NestedSortableSlotList fields={fields} move={move} />
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
