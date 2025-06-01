"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	CourseTreeItem,
	FlattenedCourseTreeItem,
	SensorContext,
} from "./components/types";
import {
	flattenTree,
	getChildCount,
	getProjection,
	removeItem,
	setProperty,
	getDragDepth,
	getMaxDepth,
	getMinDepth,
	buildTree,
} from "./utilities";
import {
	closestCenter,
	defaultDropAnimation,
	DndContext,
	DragEndEvent,
	DragMoveEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	DropAnimation,
	Modifier,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTreeItem } from "./components";
import { createPortal } from "react-dom";

interface Props {
	collapsible?: boolean;
	initialItems?: CourseTreeItem[];
	indentationWidth?: number;
	indicator?: boolean;
	removable?: boolean;
}

const dropAnimation: DropAnimation = {
	...defaultDropAnimation,
};

export function SortableTree({
	collapsible,
	initialItems,
	indicator,
	indentationWidth = 20,
	removable,
}: Props) {
	const [items, setItems] = useState<CourseTreeItem[]>(initialItems || []);

	const flattenedItems = useMemo<FlattenedCourseTreeItem[]>(() => {
		return flattenTree(items);
	}, [items]);

	const [activeId, setActiveId] = useState<string | null>(null);
	const [overId, setOverId] = useState<string | null>(null);
	const [offsetLeft, setOffsetLeft] = useState(0);
	// console.log("offsetLeft", offsetLeft);
	const [currentPosition, setCurrentPosition] = useState<{
		parentId: string | null;
		overId: string;
	} | null>(null);

	const sensorContext: SensorContext = useRef({
		items: flattenedItems,
		offset: offsetLeft,
	});

	const sortedIds = useMemo(
		() => flattenedItems.map(({ clientId }) => clientId),
		[flattenedItems]
	);

	const activeItem = activeId
		? flattenedItems.find(({ clientId }) => clientId === activeId)
		: null;

	// console.log({ activeItem });

	const projected =
		activeId && overId
			? getProjection(
					flattenedItems,
					activeId.toString(),
					overId.toString(),
					offsetLeft,
					indentationWidth
			  )
			: null;

	const sensors = useSensors(
		useSensor(PointerSensor)
		// useSensor(KeyboardSensor, {
		//   coordinateGetter,
		// })
	);

	useEffect(() => {
		sensorContext.current = {
			items: flattenedItems,
			offset: offsetLeft,
		};
	}, [flattenedItems, offsetLeft]);

	console.log("Dragging:", { activeId, overId, projected });
	// console.log("Flattened items", flattenedItems);
    // console.log(
	// 	"Rendering item:",
	// 	name,
	// 	"depth:",
	// 	depth,
	// 	"parentId:",
	// 	parentId
	// );

	// // isClient
	// const [isClient, setIsClient] = useState(false);

	// useEffect(() => {
	// 	setIsClient(true);
	// }, []);

	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return (
		<DndContext
			collisionDetection={closestCenter}
			sensors={sensors}
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
				{flattenedItems.map(({ clientId, name, depth }) => (
					<SortableTreeItem
						key={clientId}
						id={clientId}
						value={clientId}
						name={name}
						// ref={setDroppableNodeRef}
						depth={
							clientId === activeId && projected
								? projected.depth
								: depth
						}
						indentationWidth={indentationWidth}
						indicator={indicator}
						// collapsed={Boolean(collapsed && children.length)}
						// onCollapse={
						// 	collapsible && children.length
						// 		? () => handleCollapse(id)
						// 		: undefined
						// }
						onRemove={
							removable ? () => handleRemove(clientId) : undefined
						}
					/>
				))}
				{hasMounted &&
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
									id={activeItem.clientId}
									depth={activeItem.depth}
									clone
									childCount={
										getChildCount(
											items,
											activeItem.clientId
										) + 1
									}
									value={activeItem.clientId}
									indentationWidth={indentationWidth}
								/>
							) : null}
						</DragOverlay>,
						document.body
					)}
			</SortableContext>
		</DndContext>
	);

	function handleRemove(clientId: string) {
		setItems((items) => removeItem(items, clientId));
	}

	function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
		setActiveId(activeId.toString());
		setOverId(activeId.toString());

		const activeItem = flattenedItems.find(({ id }) => id === activeId);

		if (activeItem) {
			setCurrentPosition({
				parentId: activeItem.parentId,
				overId: activeId.toString(),
			});
		}

		document.body.style.setProperty("cursor", "grabbing");
	}

	function handleDragMove({ delta }: DragMoveEvent) {
		setOffsetLeft(delta.x);
	}

	function handleDragOver({ over }: DragOverEvent) {
		const newOverId = over?.id?.toString() ?? null;
		console.log("handleDragOver → overId:", newOverId);
		setOverId(newOverId);
	}

	// function handleDragEnd({ active, over }: DragEndEvent) {
	// 	resetState();

	// 	if (projected && over) {
	// 		const { depth, parentId } = projected;
	// 		const clonedItems: FlattenedCourseTreeItem[] = JSON.parse(
	// 			JSON.stringify(flattenTree(items))
	// 		);
	// 		const overId = over.id.toString();
	// 		const activeId = active.id.toString();

	// 		const overIndex = clonedItems.findIndex(
	// 			(item) => item.clientId === overId
	// 		);
	// 		const activeIndex = clonedItems.findIndex(
	// 			(item) => item.clientId === activeId
	// 		);

	// 		const activeTreeItem = clonedItems[activeIndex];

	// 		clonedItems[activeIndex] = {
	// 			...activeTreeItem,
	// 			depth,
	// 			parentId: parentId?.toString() ?? null,
	// 		};

	// 		const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
	// 		const newItems = buildTree(sortedItems);

	// 		setItems(newItems);
	// 	}
	// }

    function handleDragEnd({ active, over }: DragEndEvent) {
		resetState();

		if (!over) return;

		const clonedItems = [...flattenedItems]; // or deep clone if needed
		const activeId = active.id.toString();
		const overId = over.id.toString();

		const activeIndex = clonedItems.findIndex(
			(item) => item.clientId === activeId
		);
		const overIndex = clonedItems.findIndex(
			(item) => item.clientId === overId
		);

		const projection = getProjection(
			clonedItems,
			activeId,
			overId,
			offsetLeft,
			indentationWidth
		);
		if (!projection) return;

		const { depth, parentId } = projection;

		clonedItems[activeIndex] = {
			...clonedItems[activeIndex],
			depth,
			parentId: parentId?.toString() ?? null,
		};

		const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
		const newTree = buildTree(sortedItems);

		console.log("Built new tree", newTree);
		setItems(newTree);
	}


	// function handleDragCancel() {
	// 	setOverId(null);
	// 	setActiveId(null);
	// 	setOffsetLeft(0);
	// 	setCurrentPosition(null);

	// 	document.body.style.setProperty("cursor", "");
	// }

	function resetState() {
		setOverId(null);
		setActiveId(null);
		setOffsetLeft(0);
		setCurrentPosition(null);

		document.body.style.setProperty("cursor", "");
	}

	function handleDragCancel() {
		resetState();
	}

	// function handleCollapse(id: string) {
	// 	setItems((items) =>
	// 		setProperty(items, id, "collapsed", (value) => {
	// 			return !value;
	// 		})
	// 	);
	// }
}

const adjustTranslate: Modifier = ({ transform }) => {
	return {
		...transform,
		y: transform.y - 25,
	};
};
