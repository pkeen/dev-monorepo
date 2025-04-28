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
import { createModuleSchema, CreateModuleInput } from "../simple-schema";
import { z } from "zod";
import { createModule } from "@/lib/actions/createModule";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const NewModuleForm = () => {
	const form = useForm<CreateModuleInput>({
		resolver: zodResolver(createModuleSchema),
		defaultValues: {
			isPublished: false,
			name: "",
			description: "",
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "slots",
	});

	const router = useRouter();

	const onSubmit = async (values: CreateModuleInput) => {
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

				<Button type="submit">Save Module</Button>
			</form>
		</Form>
	);
};
