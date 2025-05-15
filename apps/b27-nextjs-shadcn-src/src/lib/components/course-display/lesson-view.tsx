import { lessonDTO } from "@pete_keen/courses/validators";
import { VideoPlayer } from "./video-player";
import { DisplayMarkdown } from "./display-markdown";
import { CustomMarkdown } from "./custom-markdow";
import { z } from "zod";

const lessonViewDTO = lessonDTO.extend({
	video: z.object({
		provider: z.string(),
		url: z.string(),
	}),
});

export type LessonView = z.infer<typeof lessonViewDTO>;

export function LessonView({ lesson }: { lesson: LessonView }) {
	return (
		<div>
			<h1>{lesson.name}</h1>
			<VideoPlayer
				provider={lesson.video.provider}
				url={lesson.video.url}
			/>
			<CustomMarkdown content={lesson.content ?? ""} />
		</div>
	);
}
