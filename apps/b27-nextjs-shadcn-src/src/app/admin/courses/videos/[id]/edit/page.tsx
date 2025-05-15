import { courses } from "@/courses";
import { EditVideoForm } from "@/lib/components/course-builder/video/edit-video-form";

export default async function EditVideoPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const video = await courses.video.get(parseInt(id));
	const videoUsage = await courses.video.findUsage(parseInt(id));
	return video ? (
		<EditVideoForm video={video} videoUsage={videoUsage} />
	) : (
		<div>Video not found</div>
	);
}
