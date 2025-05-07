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
import { UiModuleSlot } from "@pete_keen/courses/validators";

interface SlotListProps {
	fields: UiModuleSlot[];
	move: (from: number, to: number) => void;
}

const SortableSlotBlock = ({
	field,
	index,
}: {
	field: UiModuleSlot;
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
					field.content.name
						? `${index + 1}. ${field.content.name}`
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
			(slot: UiModuleSlot, index: number) => ({
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
