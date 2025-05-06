"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // if you have className utils (optional)

interface SlotBlockProps {
	// type: "module" | "lesson";
	title: string;
	type: "module" | "lesson";
	onClick: () => void;
	isDragging?: boolean; // Optional for DnD later
	order: number;
}

export function SlotBlock({
	title,
	type,
	order,
	onClick,
	isDragging,
}: SlotBlockProps) {
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
				<span className="text-2xl">
					{type === "module" ? "📚" : "🎓"}
				</span>
				<div className="font-medium">{title}</div>
			</div>

			<Button size="sm" variant="outline">
				Edit
			</Button>
		</Card>
	);
}
