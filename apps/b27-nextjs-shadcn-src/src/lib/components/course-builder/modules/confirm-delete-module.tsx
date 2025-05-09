import { ConfirmActionDialog } from "../utils/confirm-action-dialog";

export function ConfirmDeleteModuleDialog({
	onConfirm,
	open,
	setOpen,
	actionVerb,
	moduleUsage,
}: {
	onConfirm: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	actionVerb: string;
	moduleUsage: {
		inCourseSlots: number;
		totalCount: number;
	} | null;
}) {
	const warning = moduleUsage && moduleUsage.totalCount > 0 && (
		<div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded mb-4">
			This module is used in {moduleUsage.inCourseSlots} course slot
			{moduleUsage.inCourseSlots !== 1 ? "s" : ""}. Deleting it will
			remove it from those slots.
		</div>
	);
	return (
		<ConfirmActionDialog
			title={"Delete Module"}
			description={"Are you sure you want to delete this module?"}
			onConfirm={onConfirm}
			open={open}
			setOpen={setOpen}
			actionVerb={actionVerb}
			children={warning}
		/>
	);
}
