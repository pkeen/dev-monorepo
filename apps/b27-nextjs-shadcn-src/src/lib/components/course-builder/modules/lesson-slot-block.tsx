"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // if you have className utils (optional)

interface LessonSlotBlockProps {
	// type: "module" | "lesson";
	title: string;
	onClick: () => void;
	isDragging?: boolean; // Optional for DnD later
}

export function LessonSlotBlock({
	title,
	onClick,
	isDragging,
}: LessonSlotBlockProps) {
	return (
		<Card
			className={cn(
				"flex-row items-center justify-between p-4 border rounded-md cursor-pointer transition",
				isDragging && "opacity-50"
			)}
			onClick={onClick}
		>
			<div className="flex items-center gap-3">
				<span className="text-2xl">🎓</span>
				<div className="font-medium">{title}</div>
			</div>

			<Button size="sm" variant="outline">
				Edit
			</Button>
		</Card>
	);
}
