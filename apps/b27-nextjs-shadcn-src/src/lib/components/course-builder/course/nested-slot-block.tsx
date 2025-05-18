"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // if you have className utils (optional)
import { UIDeepCourseSlotOutline } from "@pete_keen/courses/validators";

interface SlotBlockProps {
	// type: "module" | "lesson";
	slot: UIDeepCourseSlotOutline;
	onClick: () => void;
	isDragging?: boolean; // Optional for DnD later
}

export function NestedSlotBlock({ slot, onClick, isDragging }: SlotBlockProps) {
	if (slot.content.type === "module") {
		return moduleSlotBlock({
			slot,
			onClick,
			isDragging,
		});
	}

	if (slot.content.type === "lesson") {
		return lessonSlotBlock({
			slot,
			onClick,
			isDragging,
		});
	}
	return null;
}

const moduleSlotBlock = ({
	slot,
	onClick,
	isDragging,
}: {
	slot: UIDeepCourseSlotOutline;
	onClick: () => void;
	isDragging?: boolean;
}) => {
	return (
		<Card
			className={cn(
				"flex-row items-center justify-between p-4 border rounded-md transition",
				"cursor-pointer",
				isDragging &&
					"opacity-50 ring-2 ring-primary/30 cursor-grabbing"
			)}
			onClick={onClick}
		>
			<div className="flex flex-col items-center gap-3">
				<div className="flex items-center gap-3">
					<span className="text-2xl">📚</span>
					<div className="font-medium">{slot.content.name}</div>
				</div>
				{slot.content.type === "module" &&
					slot.content.slots.length > 0 && (
						<span className="text-xs text-muted-foreground">
							<ul>
								{slot.content.slots.map((slot) => {
									if (slot.content.name) {
										return (
											<li key={slot.id}>
												{slot.content.name}
											</li>
										);
									}
								})}
							</ul>
						</span>
					)}
			</div>

			<Button size="sm" variant="outline">
				Edit
			</Button>
		</Card>
	);
};

const lessonSlotBlock = ({
	slot,
	onClick,
	isDragging,
}: {
	slot: UIDeepCourseSlotOutline;
	onClick: () => void;
	isDragging?: boolean;
}) => {
	return (
		<Card
			className={cn(
				"flex-row items-center justify-between p-4 border rounded-md transition",
				"cursor-pointer",
				isDragging &&
					"opacity-50 ring-2 ring-primary/30 cursor-grabbing"
			)}
			onClick={onClick}
		>
			<div className="flex items-center gap-3">
				<span className="text-2xl">🎓</span>
				<div className="font-medium">{slot.content.name}</div>
			</div>

			<Button size="sm" variant="outline">
				Edit
			</Button>
		</Card>
	);
};
