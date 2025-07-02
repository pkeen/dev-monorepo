import { courses } from "@/courses";
import { ContentEditForm } from "@pete_keen/courses-ui";

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
		<ContentEditForm contentItem={contentItem} />
	) : (
		<div>Content item not found</div>
	);
}
