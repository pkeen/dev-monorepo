"use client";
import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Within your component that receives `transform` from `useDraggable`:
// const style = {
// 	transform: CSS.Translate.toString(transform),
// };

function Droppable(props: { children: React.ReactNode }) {
	const { isOver, setNodeRef } = useDroppable({
		id: "droppable",
	});
	const style = {
		color: isOver ? "green" : undefined,
	};

	return (
		<div ref={setNodeRef} style={style}>
			{props.children}
		</div>
	);
}

function Draggable(props: { children: React.ReactNode }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: "draggable",
	});
	const style = transform
		? {
				transform: CSS.Translate.toString(transform),
		  }
		: undefined;

	return (
		<button ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{props.children}
		</button>
	);
}

export function TestDnd() {
	const [isDropped, setIsDropped] = useState(false);

	const draggableMarkup = <Draggable>Drag me</Draggable>;
	return (
		<DndContext onDragEnd={handleDragEnd}>
			{!isDropped ? draggableMarkup : null}
			<Droppable> {isDropped ? draggableMarkup : "Drop here"}</Droppable>
		</DndContext>
	);
	function handleDragEnd(event: DragEndEvent) {
		if (event.over && event.over.id === "droppable") {
			setIsDropped(true);
		}
	}
}
