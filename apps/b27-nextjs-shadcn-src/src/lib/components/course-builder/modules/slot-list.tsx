// "use client";

// import {
// 	DndContext,
// 	useSensor,
// 	useSensors,
// 	PointerSensor,
// 	closestCenter,
// 	DragEndEvent,
// } from "@dnd-kit/core";

// import {
// 	arrayMove,
// 	SortableContext,
// 	useSortable,
// 	verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { ModuleSlotOutline } from "@pete_keen/courses/types";
// import { LessonSlotBlock } from "./lesson-slot-block";
// import React, { useState } from "react";

// import { CSS } from "@dnd-kit/utilities";
// import { useFormContext } from "react-hook-form";

// const demoData: ModuleSlotOutline[] = [
// 	{
// 		id: 1,
// 		moduleId: 1,
// 		lessonId: 1,
// 		lesson: {
// 			id: 1,
// 			name: "Lesson 1",
// 		},
// 		order: 1,
// 	},
// 	{
// 		id: 2,
// 		moduleId: 1,
// 		lessonId: 2,
// 		lesson: {
// 			id: 2,
// 			name: "Lesson 2",
// 		},
// 		order: 2,
// 	},
// ];

// const SortableSlotBlock = ({
// 	field,
// 	index,
// }: {
// 	field: ModuleSlotOutline;
// 	index: number;
// }) => {
// 	const { attributes, listeners, setNodeRef, transform, transition } =
// 		useSortable({ id: field.lesson.id });

// 	const style = {
// 		transform: CSS.Transform.toString(transform),
// 		transition,
// 	};

// 	return (
// 		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
// 			<LessonSlotBlock
// 				key={field.lesson.id}
// 				title={
// 					field.lesson.name
// 						? `${index + 1}. ${field.lesson.name}`
// 						: `Lesson ${index + 1}`
// 				}
// 				onClick={() => {
// 					/* open edit modal */
// 				}}
// 			/>
// 		</div>
// 	);
// };

// interface SlotListProps {
// 	fields: ModuleSlotOutline[];
// 	move: (from: number, to: number) => void;
// 	update: (index: number, value: any) => void;
// }

// export const SlotList = ({
// 	fields = demoData,
// 	move,
// 	update,
// }: SlotListProps) => {
// 	const { getValues, setValue } = useFormContext();

// 	// const [items, setItems] = useState(fields);
// 	const sensors = useSensors(
// 		useSensor(PointerSensor, {
// 			activationConstraint: { distance: 8 },
// 		})
// 	);
// 	const applyOrder = <T extends object>(
// 		list: T[]
// 	): (T & { order: number })[] => {
// 		return list.map((item, index) => ({ ...item, order: index }));
// 	};
// 	// const handleDragEnd = (event: DragEndEvent) => {
// 	// 	const { active, over } = event;

// 	// 	if (!over || active.id === over.id) return;

// 	// 	const oldIndex = items.findIndex((i) => i.lesson.id === active.id);
// 	// 	const newIndex = items.findIndex((i) => i.lesson.id === over.id);

// 	// 	if (oldIndex === -1 || newIndex === -1) return;

// 	// 	const newItems = applyOrder(arrayMove(items, oldIndex, newIndex));
// 	// 	setItems(newItems);
// 	// };
// 	const handleDragEnd = (event: DragEndEvent) => {
// 		const { active, over } = event;

// 		if (!over || active.id === over.id) return;

// 		const oldIndex = fields.findIndex((f) => f.id === active.id);
// 		const newIndex = fields.findIndex((f) => f.id === over.id);
// 		if (oldIndex === -1 || newIndex === -1) return;

// 		move(oldIndex, newIndex);

// 		// Reassign `.order` fields in form state after reordering
// 		const updatedSlots = getValues("lessonSlots").map(
// 			(slot: ModuleSlotOutline, index: number) => ({
// 				...slot,
// 				order: index,
// 			})
// 		);

// 		setValue("lessonSlots", updatedSlots);
// 	};

// 	return (
// 		<DndContext
// 			sensors={sensors}
// 			collisionDetection={closestCenter}
// 			onDragEnd={handleDragEnd}
// 		>
// 			<SortableContext
// 				items={fields}
// 				strategy={verticalListSortingStrategy}
// 			>
// 				{fields.map((field, index) => (
// 					<SortableSlotBlock
// 						key={field.lesson.id}
// 						field={field}
// 						index={index}
// 					/>
// 				))}
// 			</SortableContext>
// 		</DndContext>
// 	);
// };
"use client";

import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
	useSortable,
} from "@dnd-kit/sortable";
import { useFormContext } from "react-hook-form";
// import { ModuleSlotOutline } from "@pete_keen/courses/types";
import { CSS } from "@dnd-kit/utilities";
import { LessonSlotBlock } from "./lesson-slot-block";
import { FrontendModuleSlot } from "./module-edit-form";

interface SlotListProps {
	fields: FrontendModuleSlot[];
	move: (from: number, to: number) => void;
}

const SortableSlotBlock = ({
	field,
	index,
}: {
	field: FrontendModuleSlot;
	index: number;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: field.clientId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<LessonSlotBlock
				key={field.clientId}
				title={
					field.lesson.name
						? `${index + 1}. ${field.lesson.name}`
						: `Lesson ${index + 1}`
				}
				order={field.order}
				isDragging={isDragging}
				onClick={() => {
					/* open edit modal */
				}}
			/>
		</div>
	);
};

export const SortableSlotList = ({ fields, move }: SlotListProps) => {
	const { getValues, setValue } = useFormContext();

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = fields.findIndex((f) => f.clientId === active.id);
		const newIndex = fields.findIndex((f) => f.clientId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		move(oldIndex, newIndex);

		// Reassign `.order` fields in form state after reordering
		const updatedSlots = getValues("slots").map(
			(slot: FrontendModuleSlot, index: number) => ({
				...slot,
				order: index,
			})
		);

		setValue("slots", updatedSlots);
	};

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<SortableContext
				items={fields.map((f) => f.clientId)}
				strategy={verticalListSortingStrategy}
			>
				{/* <div className="space-y-2"> */}
				{fields
					.sort((a, b) => a.order - b.order)
					.map((field, index) => (
						<SortableSlotBlock
							key={field.id}
							field={field}
							index={index}
						/>
					))}
				{/* </div> */}
			</SortableContext>
		</DndContext>
	);
};
