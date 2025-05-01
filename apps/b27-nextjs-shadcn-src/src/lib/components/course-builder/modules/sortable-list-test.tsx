"use client";
import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Within your component that receives `transform` from `useDraggable`:
// const style = {
// 	transform: CSS.Translate.toString(transform),
// };
type Item = {
	id: number;
	name: string;
};

const itemsList = [
	{ id: 1, name: "Item 1" },
	{ id: 2, name: "Item 2" },
	{ id: 3, name: "Item 3" },
];

function SortableItem({ item }: { item: Item }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{item.name}
		</div>
	);
}

export function SortableListTest() {
	const [isDropped, setIsDropped] = useState(false);
	const [items, setItems] = useState<Item[]>(itemsList);

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<SortableContext
				items={items}
				strategy={verticalListSortingStrategy}
			>
				{items.map((item) => (
					<SortableItem key={item.id} item={item} />
				))}
			</SortableContext>
			{/* <Droppable> {isDropped ? "Drag me" : "Drop here"}</Droppable> */}
		</DndContext>
	);
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex((i) => i.id === active.id);
		const newIndex = items.findIndex((i) => i.id === over.id);

		const newItems = arrayMove(items, oldIndex, newIndex);
		setItems(newItems);
	}
}
