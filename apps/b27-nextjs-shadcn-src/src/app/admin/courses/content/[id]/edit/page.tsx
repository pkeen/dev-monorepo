import { courses } from "@/courses";
import { ModuleEditForm } from "@/lib/components/course-builder/modules/module-edit-form";

export default async function ContentEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const contentItem = await courses.content.get(parseInt(id));
	// const lessons = await courses.lesson.list();
	// const moduleUsage = await courses.module.findUsage(parseInt(id));
	return contentItem ? (
		<div>{contentItem.title}</div>
	) : (
		<div>Content item not found</div>
	);
}
