import { Button } from "@/components/ui/button";
import { courses } from "@/courses";
import { VideoTable } from "@/lib/components/course-builder/video/video-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function VideosPage() {
	const videos = await courses.video.list();
	return (
		<div className="space-y-4">
			<Button variant="default" size="sm" asChild>
				<Link
					href="/admin/courses/videos/new"
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Video
				</Link>
			</Button>
			<VideoTable videos={videos} />
		</div>
	);
}
