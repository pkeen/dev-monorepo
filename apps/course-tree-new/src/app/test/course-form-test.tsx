"use client";
import {
	CourseTreeDTO,
	EditCourseTreeDTO,
} from "@pete_keen/courses/validators";
import { SortableTree } from "@pete_keen/courses-ui";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { updateCourseTree } from "../../lib/actions";

export function CoursesForm({ course }: { course: EditCourseTreeDTO }) {
	const { register, handleSubmit, control } = useForm<CourseTreeDTO>({
		defaultValues: course,
	});

	const onSubmit = (data: EditCourseTreeDTO) => {
		console.log("🚨 Submitting items:", data.items);
		updateCourseTree(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="title">Course Name</label>
					<input {...register("title")} placeholder="Course Name" />
				</div>
				<div>
					<label htmlFor="description">Description</label>
					<textarea
						{...register("description")}
						placeholder="Description"
					/>
				</div>

				<Controller
					control={control}
					name="items"
					render={({ field }) => (
						<SortableTree
							items={field.value}
							onChange={field.onChange}
							indicator={true}
							removable={true}
							collapsible={true}
							indentationWidth={50}
						/>
					)}
				/>

				<button type="submit">Save</button>
			</form>
		</div>
	);
}
