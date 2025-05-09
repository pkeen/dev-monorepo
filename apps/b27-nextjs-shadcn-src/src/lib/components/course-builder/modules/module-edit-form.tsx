"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { UiModule, uiModuleDTO } from "@pete_keen/courses/validators";
import { Lesson } from "@pete_keen/courses/types";
import { z } from "zod";
import { AddSlotDialog } from "./add-lesson-dialog";
import { useMemo, useState, useTransition } from "react";
import { SelectExistingDialog } from "../course/select-existing";
import { SortableSlotList } from "./module-slot-list";
import { editModule } from "@/lib/actions/module/editModule";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

function withClientIds(module: UiModule): UiModule {
	return {
		...module,
		description:
			module.description === null ? undefined : module.description,
		slots: module.slots.map((slot, i) => ({
			...slot,
			clientId:
				slot.clientId ?? (slot.id ? `slot-${slot.id}` : `new-${i}`),
		})),
	};
}

export const ModuleEditForm = ({
	module,
	existingLessons,
}: {
	module: UiModule;
	existingLessons: Lesson[];
}) => {
	// 🟣 1. Build a *stable* clientId without randomness
	const defaultValues = useMemo(() => withClientIds(module), [module]);

	const form = useForm({
		resolver: zodResolver(uiModuleDTO),
		defaultValues,
	});

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const router = useRouter();

	const onSubmit = (values: z.infer<typeof uiModuleDTO>) => {
		startTransition(async () => {
			try {
				const module = await editModule(values);
				toast.success("Module updated!");
				form.reset(withClientIds(module));
				router.refresh();
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
								<Textarea
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
						<SelectExistingDialog
							title="Select Existing Lesson"
							open={selectLessonOpen}
							onOpenChange={setSelectLessonOpen}
							items={existingLessons}
							onSelect={(item) => {
								append({
									id: undefined,
									clientId: crypto.randomUUID(),
									moduleId: module.id,
									lessonId: item.id,
									order: fields.length, // <-- Important: add at end
									content: {
										id: item.id,
										name: item.name,
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

				<Button
					type="submit"
					className="mt-4 cursor-pointer"
					disabled={!form.formState.isDirty || isPending}
				>
					Save Module
				</Button>
			</form>
		</Form>
	);
};
