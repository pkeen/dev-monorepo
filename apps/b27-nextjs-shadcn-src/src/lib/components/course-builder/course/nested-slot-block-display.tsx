"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // if you have className utils (optional)
import {
	UiSlotDeep,
	UiModuleSlotDeep,
	UiCourseDeep,
	UiCourseSlotDisplay,
	UiCourseDisplay,
	UiModuleSlotDisplay,
} from "@pete_keen/courses/validators";
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
import { CSS } from "@dnd-kit/utilities";
import { useFieldArray, useFormContext } from "react-hook-form";

interface SlotBlockProps {
	// type: "module" | "lesson";
	slot: UiCourseSlotDisplay;
	onClick: () => void;
	isDragging?: boolean;
	index: number; // Optional for DnD later
}

export function NestedSlotBlock({
	slot,
	onClick,
	isDragging,
	index,
}: SlotBlockProps) {
	if (slot.moduleId) {
		return moduleSlotBlock({
			slot,
			onClick,
			isDragging,
			index,
		});
	}

	if (slot.lessonId) {
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
	index,
	onClick,
	isDragging,
}: {
	slot: UiCourseSlotDisplay;
	index: number;
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
				<div className="flex flex-row items-center gap-3">
					<span className="text-2xl">📚</span>
					<div className="font-medium">{slot.display.name}</div>
				</div>
				{slot.moduleSlots && (
					<ModuleSlotList
						parentIndex={index}
						// move={move}
					/>
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
	slot: UiCourseSlotDisplay;
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
			<div className="flex flex-row items-center gap-3">
				<span className="text-2xl">🎓</span>
				<div className="font-medium">{slot.display.name}</div>
			</div>

			<Button size="sm" variant="outline">
				Edit
			</Button>
		</Card>
	);
};

const ModuleSlotList = ({ parentIndex }: { parentIndex: number }) => {
	const { getValues, setValue, control } = useFormContext<UiCourseDisplay>();

	const { fields: moduleSlots, move } = useFieldArray<
		UiCourseDisplay, // full form schema
		`slots.${number}.moduleSlots`, // field name path
		string // item index
	>({
		control,
		name: `slots.${parentIndex}.moduleSlots` as const,
	});

	const safeModuleSlots =
		moduleSlots as unknown as Array<UiModuleSlotDisplay>;

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = moduleSlots.findIndex((f) => f.clientId === active.id);
		const newIndex = moduleSlots.findIndex((f) => f.clientId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		move(oldIndex, newIndex);

		const updated = (
			getValues(`slots.${parentIndex}.moduleSlots`) ?? []
		).map((slot, i) => ({
			...slot,
			order: i,
		}));

		setValue(`slots.${parentIndex}.moduleSlots`, updated);
	};

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<SortableContext
				items={safeModuleSlots.map((f) => f.clientId)}
				strategy={verticalListSortingStrategy}
			>
				{safeModuleSlots.map((slot, index) => (
					<SortableLesson
						key={slot.clientId}
						moduleSlot={slot}
						index={index}
					/>
				))}
			</SortableContext>
		</DndContext>
	);
};

const SortableLesson = ({
	moduleSlot,
	index,
}: {
	moduleSlot: UiModuleSlotDisplay;
	index: number;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: moduleSlot.clientId }); // Need to create a clientId for this

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			className="space-y-2"
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<div className="flex flex-row items-center gap-3">
				<span className="text-2xl">🎓</span>
				<div className="font-medium">{moduleSlot.display.name}</div>
			</div>
		</div>
	);
};
