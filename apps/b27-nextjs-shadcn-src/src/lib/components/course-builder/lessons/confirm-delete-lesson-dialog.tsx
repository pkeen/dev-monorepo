import { ConfirmActionDialog } from "../utils/confirm-action-dialog";

export function ConfirmDeleteLessonDialog({
	onConfirm,
	open,
	setOpen,
	actionVerb,
	lessonUsage,
}: {
	onConfirm: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	actionVerb: string;
	lessonUsage?: {
		inCourseSlots: number;
		inModuleSlots: number;
		total: number;
	};
}) {
	const warning = lessonUsage && lessonUsage.total > 0 && (
		<div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded mb-4">
			This lesson is used in {lessonUsage.inCourseSlots} course slot
			{lessonUsage.inCourseSlots !== 1 ? "s" : ""} and{" "}
			{lessonUsage.inModuleSlots} module slot
			{lessonUsage.inModuleSlots !== 1 ? "s" : ""}. Deleting it will
			remove it from those slots.
		</div>
	);
	return (
		<ConfirmActionDialog
			title={"Delete Lesson"}
			description={"Are you sure you want to delete this lesson?"}
			onConfirm={onConfirm}
			open={open}
			setOpen={setOpen}
			actionVerb={actionVerb}
			children={warning}
		/>
	);
}
