import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SlotFormFields } from "./slot-form-fields";
import { ModuleSlots } from "./module-slot";
import { CourseFormValues, SlotPath } from "./schema";
import { useWatch } from "react-hook-form";

interface CourseSlotProps {
	control: Control<CourseFormValues>;
	nestIndex: number;
	nestPath: SlotPath;
	remove: () => void;
}

export function CourseSlot({
	control,
	nestIndex,
	nestPath,
	remove,
}: CourseSlotProps) {
	// inside the CourseSlot component:
	const type = useWatch({ control, name: `${nestPath}.type` });

	const isTopLevel = !nestPath.includes(".data.slots.");
	const displayIndex = isTopLevel
		? `${nestIndex + 1}.`
		: String.fromCharCode(97 + nestIndex) + "."; // 97 = 'a'

	return (
		<Card className="p-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="font-bold">
					{displayIndex} {type === "module" ? "Module" : "Lesson"}
				</div>
				<Button
					type="button"
					size="sm"
					variant="destructive"
					onClick={remove}
				>
					Delete
				</Button>
			</div>

			{/* Common fields (name, description, publish) */}
			<SlotFormFields control={control} basePath={`${nestPath}.data`} />

			{/* If it's a module, render nested slots */}
			<ModuleSlots control={control} nestPath={nestPath} />
		</Card>
	);
}
