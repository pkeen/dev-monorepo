"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Module } from "@pete_keen/courses/types";

interface SelectExistingModuleProps {
	title: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: Module[];
	onSelect: (item: Module) => void;
}

export function SelectExistingModule({
	title,
	open,
	onOpenChange,
	items,
	onSelect,
}: SelectExistingModuleProps) {
	const [search, setSearch] = useState("");

	const filteredItems = items.filter((item) =>
		item.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleSelect = (item: Module) => {
		onSelect(item);
		onOpenChange(false); // Close after selecting
	};

	console.log("SelectExistingModule open:", open);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<Input
					placeholder="Search modules..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<ScrollArea className="max-h-60">
					<div className="flex flex-col gap-2 py-2">
						{filteredItems.map((item) => (
							<Button
								key={item.id}
								variant="ghost"
								className="justify-start"
								onClick={() => handleSelect(item)}
							>
								<div>
									<div className="font-medium">
										{item.name}
									</div>
									{/* <div className="text-sm text-muted-foreground">
										{item.description}
									</div> */}
								</div>
							</Button>
						))}
					</div>
				</ScrollArea>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
