import { courses } from "@/courses";
import { ModuleEditForm } from "@/lib/components/course-builder/modules/module-edit-form";

// async function getModuleFull(id: string) {
// 	const module = await courses.module.get(id);
// 	if (!module) return null;
// 	const slots = await courses.moduleSlot.list({
// 		where: {
// 			moduleId: module.id,
// 		},
// 	});
// 	return { module, slots };
// }

export default async function ModuleEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const module = await courses.module.outline(id);
	return module ? (
		<ModuleEditForm module={module} />
	) : (
		<div>Module not found</div>
	);
}
