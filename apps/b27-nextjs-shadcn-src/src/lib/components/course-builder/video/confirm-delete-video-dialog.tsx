import { ConfirmActionDialog } from "../utils/confirm-action-dialog";
import { VideoUsage } from "@pete_keen/courses/types";

export function ConfirmDeleteVideoDialog({
	onConfirm,
	open,
	setOpen,
	actionVerb,
	videoUsage,
}: {
	onConfirm: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	actionVerb: string;
	videoUsage?: VideoUsage;
}) {
	const warning = videoUsage && videoUsage.totalCount > 0 && (
		<div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded mb-4">
			This video is used in {videoUsage.inLessons.length} lesson
			{videoUsage.inLessons.length !== 1 ? "s" : ""}. Deleting it will
			remove it from those lessons.
		</div>
	);
	return (
		<ConfirmActionDialog
			title={"Delete Video"}
			description={"Are you sure you want to delete this video?"}
			onConfirm={onConfirm}
			open={open}
			setOpen={setOpen}
			actionVerb={actionVerb}
			children={warning}
		/>
	);
}
