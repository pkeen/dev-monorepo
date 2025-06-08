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
import { UiCourseSlotDisplay } from "@pete_keen/courses/validators";
import { CSS } from "@dnd-kit/utilities";
import { NestedSlotBlock } from "./nested-slot-block-display";

const parseId = (id: string) => {
	const [type, ...rest] = id.split("-");
	return { type, key: rest.join("-") };
};



interface SlotListProps {
	fields: UiCourseSlotDisplay[];
	move: (from: number, to: number) => void;
}

const NestedSortableSlotBlock = ({
	field,
	index,
}: {
	field: UiCourseSlotDisplay; // May need to change to create type to allow for no ids
	index: number;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: `top-${field.clientId}` });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<NestedSlotBlock
				key={field.clientId}
				slot={field}
				onClick={() => {
					/* open edit modal */
				}}
				index={index}
				isDragging={isDragging}
			/>
		</div>
	);
};

export const NestedSortableSlotList = ({ fields, move }: SlotListProps) => {
	const { getValues, setValue } = useFormContext();

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
	);

	const sortedFields = [...fields].sort((a, b) => a.order - b.order);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!active || !over) return;

		const from = parseId(active.id as string);
		const to = parseId(over.id as string);

		if (from.type === "top" && to.type === "mod") {
			// Find top-level slot and remove it
			const slots = getValues("slots");
			const sourceIndex = slots.findIndex(
				(s: UiCourseSlotDisplay) => s.clientId === from.key
			);
			const itemToMove = slots[sourceIndex];

			const [moduleIndexStr] = to.key.split("-");
			const moduleIndex = parseInt(moduleIndexStr);

			// Remove from top-level
			slots.splice(sourceIndex, 1);

			// Add to module
			const moduleSlots = slots[moduleIndex].moduleSlots || [];
			moduleSlots.push({
				...itemToMove,
				order: moduleSlots.length,
			});

			slots[moduleIndex].moduleSlots = moduleSlots;

			// Update order of all slots
			const reordered = slots.map(
				(s: UiCourseSlotDisplay, i: number) => ({ ...s, order: i })
			);
			setValue("slots", reordered);
		}
	};

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<SortableContext
				items={sortedFields.map((f) => f.clientId)}
				strategy={verticalListSortingStrategy}
			>
				{/* <div className="space-y-2"> */}
				{sortedFields
					.map((field, index) => (
						<NestedSortableSlotBlock
							key={field.clientId}
							field={field}
							index={index}
						/>
					))}
				{/* </div> */}
			</SortableContext>
		</DndContext>
	);
};
