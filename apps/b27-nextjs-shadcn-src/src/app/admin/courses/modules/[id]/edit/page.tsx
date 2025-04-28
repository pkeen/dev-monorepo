import { courses } from "@/courses";
import { ModuleEditForm } from "@/lib/components/course-builder/modules/module-edit-form";

export default async function ModuleEditPage({
	params,
}: {
	params: { id: string };
}) {
	const module = await courses.module.get(params.id);
	return module ? (
		<ModuleEditForm module={module} />
	) : (
		<div>Module not found</div>
	);
}
