"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	Announcements,
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragOverlay,
	DragMoveEvent,
	DragEndEvent,
	DragOverEvent,
	MeasuringStrategy,
	DropAnimation,
	defaultDropAnimation,
	Modifier,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
	buildTree,
	flattenTree,
	getProjection,
	getChildCount,
	removeItem,
	removeChildrenOf,
	setProperty,
} from "./utilities";
import type { FlattenedItem, SensorContext, TreeItems } from "./types";
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import { SortableTreeItem } from "./components";

const initialItems: TreeItems = [
	{
		id: "Course",
		name: "Course",
		children: [
			{
				id: "Module",
				name: "Module",
				children: [
					{
						id: "Lesson",
						name: "Lesson",
						children: [
							{
								id: "Learning Object",
								name: "Learning Object",
								children: [],
							},
						],
					},
				],
			},
		],
	},
	{
		id: "Course 1",
		name: "Course 1",
		children: [
			{
				id: "Module 1",
				name: "Module 1",
				children: [
					{
						id: "Lesson 1",
						name: "Lesson 1",
						children: [
							{
								id: "Learning Object 1",
								name: "Learning Object 1",
								children: [],
							},
						],
					},
				],
			},
		],
	},
	{
		id: "Course 2",
		name: "Course 2",
		children: [
			{
				id: "Module 2",
				name: "Module 2",
				children: [
					{
						id: "Lesson 2",
						name: "Lesson 2",
						children: [
							{
								id: "Learning Object 2",
								name: "Learning Object 2",
								children: [],
							},
						],
					},
				],
			},
		],
	},
];

const measuring = {
	droppable: {
		strategy: MeasuringStrategy.Always,
	},
};

const dropAnimation: DropAnimation = {
	...defaultDropAnimation,
	dragSourceOpacity: 0.5,
};

interface Props {
	collapsible?: boolean;
	defaultItems?: TreeItems;
	indentationWidth?: number;
	indicator?: boolean;
	removable?: boolean;
}

export function SortableTree({
	collapsible,
	defaultItems = initialItems,
	indicator,
	indentationWidth = 20,
	removable,
}: Props) {
	const [items, setItems] = useState(() => defaultItems);
	console.log({ items });
	const [activeId, setActiveId] = useState<string | null>(null);
	const [overId, setOverId] = useState<string | null>(null);
	const [offsetLeft, setOffsetLeft] = useState(0);
	const [currentPosition, setCurrentPosition] = useState<{
		parentId: string | null;
		overId: string;
	} | null>(null);

	const flattenedItems = useMemo(() => {
		const flattenedTree = flattenTree(items);
		const collapsedItems = flattenedTree.reduce<string[]>(
			(acc, { children, collapsed, id }) =>
				collapsed && children.length ? [...acc, id] : acc,
			[]
		);

		return removeChildrenOf(
			flattenedTree,
			activeId ? [activeId, ...collapsedItems] : collapsedItems
		);
	}, [activeId, items]);
	const projected =
		activeId && overId
			? getProjection(
					flattenedItems,
					activeId,
					overId,
					offsetLeft,
					indentationWidth
			  )
			: null;
	const sensorContext: SensorContext = useRef({
		items: flattenedItems,
		offset: offsetLeft,
	});
	const sensors = useSensors(
		useSensor(PointerSensor)
		// useSensor(KeyboardSensor, {
		//   coordinateGetter,
		// })
	);

	const sortedIds = useMemo(
		() => flattenedItems.map(({ id }) => id),
		[flattenedItems]
	);
	const activeItem = activeId
		? flattenedItems.find(({ id }) => id === activeId)
		: null;

	useEffect(() => {
		sensorContext.current = {
			items: flattenedItems,
			offset: offsetLeft,
		};
	}, [flattenedItems, offsetLeft]);

	const announcements: Announcements = {
		onDragStart({ active: { id } }) {
			return `Picked up ${id}.`;
		},
		onDragMove({ active: { id }, over }) {
			return getMovementAnnouncement("onDragMove", id, over?.id);
		},
		onDragOver({ active: { id }, over }) {
			return getMovementAnnouncement("onDragOver", id, over?.id);
		},
		onDragEnd({ active: { id }, over }) {
			return getMovementAnnouncement("onDragEnd", id, over?.id);
		},
		onDragCancel({ active: { id } }) {
			return `Moving was cancelled. ${id} was dropped in its original position.`;
		},
	};

	// isClient
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	console.log({ isClient });

	return (
		<DndContext
			announcements={announcements}
			sensors={sensors}
			collisionDetection={closestCenter}
			measuring={measuring}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<SortableContext
				items={sortedIds}
				strategy={verticalListSortingStrategy}
			>
				{flattenedItems.map(({ id, children, collapsed, depth }) => (
					<SortableTreeItem
						key={id}
						id={id}
						value={id}
						name={id}
						// ref={setDroppableNodeRef}
						depth={
							id === activeId && projected
								? projected.depth
								: depth
						}
						indentationWidth={indentationWidth}
						indicator={indicator}
						collapsed={Boolean(collapsed && children.length)}
						onCollapse={
							collapsible && children.length
								? () => handleCollapse(id)
								: undefined
						}
						onRemove={
							removable ? () => handleRemove(id) : undefined
						}
					/>
				))}
				{isClient &&
					createPortal(
						<DragOverlay
							dropAnimation={dropAnimation}
							modifiers={
								indicator ? [adjustTranslate] : undefined
							}
						>
							{activeId && activeItem ? (
								<SortableTreeItem
									name={activeItem.name}
									id={activeId}
									depth={activeItem.depth}
									clone
									childCount={
										getChildCount(items, activeId) + 1
									}
									value={activeId}
									indentationWidth={indentationWidth}
								/>
							) : null}
						</DragOverlay>,
						document.body
					)}
			</SortableContext>
		</DndContext>
	);

	function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
		setActiveId(activeId);
		setOverId(activeId);

		const activeItem = flattenedItems.find(({ id }) => id === activeId);

		if (activeItem) {
			setCurrentPosition({
				parentId: activeItem.parentId,
				overId: activeId,
			});
		}

		document.body.style.setProperty("cursor", "grabbing");
	}

	function handleDragMove({ delta }: DragMoveEvent) {
		setOffsetLeft(delta.x);
	}

	function handleDragOver({ over }: DragOverEvent) {
		setOverId(over?.id ?? null);
	}

	function handleDragEnd({ active, over }: DragEndEvent) {
		resetState();

		if (projected && over) {
			const { depth, parentId } = projected;
			const clonedItems: FlattenedItem[] = JSON.parse(
				JSON.stringify(flattenTree(items))
			);
			const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
			const activeIndex = clonedItems.findIndex(
				({ id }) => id === active.id
			);
			const activeTreeItem = clonedItems[activeIndex];

			clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

			const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
			const newItems = buildTree(sortedItems);

			setItems(newItems);
		}
	}

	function handleDragCancel() {
		resetState();
	}

	function resetState() {
		setOverId(null);
		setActiveId(null);
		setOffsetLeft(0);
		setCurrentPosition(null);

		document.body.style.setProperty("cursor", "");
	}

	function handleRemove(id: string) {
		setItems((items) => removeItem(items, id));
	}

	function handleCollapse(id: string) {
		setItems((items) =>
			setProperty(items, id, "collapsed", (value) => {
				return !value;
			})
		);
	}

	function getMovementAnnouncement(
		eventName: string,
		activeId: string,
		overId?: string
	) {
		if (overId && projected) {
			if (eventName !== "onDragEnd") {
				if (
					currentPosition &&
					projected.parentId === currentPosition.parentId &&
					overId === currentPosition.overId
				) {
					return;
				} else {
					setCurrentPosition({
						parentId: projected.parentId,
						overId,
					});
				}
			}

			const clonedItems: FlattenedItem[] = JSON.parse(
				JSON.stringify(flattenTree(items))
			);
			const overIndex = clonedItems.findIndex(({ id }) => id === overId);
			const activeIndex = clonedItems.findIndex(
				({ id }) => id === activeId
			);
			const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

			const previousItem = sortedItems[overIndex - 1];

			let announcement;
			const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
			const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

			if (!previousItem) {
				const nextItem = sortedItems[overIndex + 1];
				announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
			} else {
				if (projected.depth > previousItem.depth) {
					announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
				} else {
					let previousSibling: FlattenedItem | undefined =
						previousItem;
					while (
						previousSibling &&
						projected.depth < previousSibling.depth
					) {
						const parentId: string | null =
							previousSibling.parentId;
						previousSibling = sortedItems.find(
							({ id }) => id === parentId
						);
					}

					if (previousSibling) {
						announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
					}
				}
			}

			return announcement;
		}

		return;
	}
}

const adjustTranslate: Modifier = ({ transform }) => {
	return {
		...transform,
		y: transform.y - 25,
	};
};
