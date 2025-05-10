import { courses } from "@/courses";
import { ModuleEditForm } from "@/lib/components/course-builder/modules/module-edit-form";

export default async function ModuleEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const module = await courses.module.outline(parseInt(id));
	const lessons = await courses.lesson.list();
	const moduleUsage = await courses.module.findUsage(parseInt(id));
	return module ? (
		<ModuleEditForm
			module={module}
			existingLessons={lessons}
			moduleUsage={moduleUsage}
		/>
	) : (
		<div>Module not found</div>
	);
}
