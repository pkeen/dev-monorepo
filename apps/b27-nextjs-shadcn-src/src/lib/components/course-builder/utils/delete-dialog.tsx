import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DeleteDialogProps {
	trigger?: React.ReactNode;
	title: string;
	description: string;
	onDelete: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
}

export function DeleteDialog({
	trigger,
	title,
	description,
	onDelete,
	open,
	setOpen,
	children,
}: DeleteDialogProps) {
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		try {
			setLoading(true);
			await onDelete();
			setOpen(false);
		} finally {
			setLoading(false);
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>} */}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<p>{description}</p>
				{children}
				<div className="flex justify-end gap-2 mt-4">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={() => handleDelete()} disabled={loading}>
						{loading ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
