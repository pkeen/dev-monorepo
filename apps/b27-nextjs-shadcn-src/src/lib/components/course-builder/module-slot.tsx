import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CourseFormValues, SlotPath } from "./schema";
import { CourseSlot } from "./course-slot";

interface ModuleSlotsProps {
	control: Control<CourseFormValues>;
	nestPath: SlotPath;
}

export function ModuleSlots({ control, nestPath }: ModuleSlotsProps) {
	const type = useWatch({ control, name: `${nestPath}.type` });

	if (type !== "module") {
		return null;
	}

	const { fields, append, remove } = useFieldArray({
		control,
		name: `${nestPath}.data.slots`,
	});

	return (
		<div className="space-y-2 ml-4 border-l-2 pl-4">
			<div className="flex gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() =>
						append({
							id: crypto.randomUUID(),
							type: "module",
							data: {
								name: "",
								description: "",
								isPublished: false,
								slots: [],
							},
						})
					}
				>
					+ Add Module
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() =>
						append({
							id: crypto.randomUUID(),
							type: "lesson",
							data: {
								name: "",
								description: "",
								isPublished: false,
							},
						})
					}
				>
					+ Add Lesson
				</Button>
			</div>

			{fields.map((field, index) => (
				<CourseSlot
					key={field.id}
					nestIndex={index}
					nestPath={`${nestPath}.data.slots.${index}`}
					control={control}
					remove={() => remove(index)}
				/>
			))}
		</div>
	);
}
