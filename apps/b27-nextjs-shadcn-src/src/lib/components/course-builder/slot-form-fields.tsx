import { Control } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CourseFormValues, SlotPath } from "./schema";

interface SlotFormFieldsProps {
	control: Control<CourseFormValues>;
	basePath: SlotPath;
}

export function SlotFormFields({ control, basePath }: SlotFormFieldsProps) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name={`${basePath}.name`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input placeholder="Name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name={`${basePath}.description`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Input placeholder="Description" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name={`${basePath}.isPublished`}
				render={({ field }) => (
					<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
						<FormLabel>Publish</FormLabel>
						<FormControl>
							<Switch
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
