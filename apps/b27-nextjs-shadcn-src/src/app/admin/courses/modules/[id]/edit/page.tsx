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
	const lessons = await courses.lesson.list();
	return module ? (
		<ModuleEditForm module={module} existingLessons={lessons} />
	) : (
		<div>Module not found</div>
	);
}
