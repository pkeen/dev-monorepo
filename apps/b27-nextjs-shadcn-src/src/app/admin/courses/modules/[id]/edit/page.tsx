import { courses } from "@/courses";
import { ModuleEditForm } from "@/lib/components/course-builder/modules/module-edit-form";

export default async function ModuleEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const module = await courses.module.get(id);
	return module ? (
		<ModuleEditForm module={module} />
	) : (
		<div>Module not found</div>
	);
}
