"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CourseTreeItem, FlattenedCourseTreeItem } from "./types";
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
	SensorContext,
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
	const [currentPosition, setCurrentPosition] = useState<{
		parentId: string | null;
		overId: string;
	} | null>(null);

	const sensorContext = useRef<SensorContext>({
		activatorEvent: null,
		active: null,
		activeNode: null,
		collisionRect: null,
		items: flattenedItems,
		offset: offsetLeft,
	});

	const activeItem = activeId
		? flattenedItems.find(({ clientId }) => clientId === activeId)
		: null;

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
			activatorEvent: null,
			active: null,
			activeNode: null,
			collisionRect: null,
			items: flattenedItems,
			offset: offsetLeft,
		};
	}, [flattenedItems, offsetLeft]);

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
		<DndContext collisionDetection={closestCenter}>
			<SortableContext
				items={flattenedItems}
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

	function handleRemove(clientId: string) {
		setItems((items) => removeItem(items, clientId));
	}

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;
		setActiveId(active.id.toString());
		setOverId(null);
	}

	function handleDragMove({ delta }: DragMoveEvent) {
		setOffsetLeft(delta.x);
	}

	function handleDragOver({ over }: DragOverEvent) {
		setOverId(over?.id ?? null);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over?.id.toString() === active.id.toString()) {
			return;
		}

		const activeItem = flattenedItems.find(
			(item) => item.id.toString() === active.id.toString()
		);

		if (!activeItem) {
			return;
		}

		const newItems = arrayMove(
			flattenedItems,
			activeItem.index,
			over?.index || 0
		);
		const previousItem = newItems[over?.index || 0 - 1];
		const nextItem = newItems[over?.index || 0 + 1];
		const dragDepth = getDragDepth(offsetLeft, indentationWidth);
		const projectedDepth = activeItem.depth + dragDepth;
		const maxDepth = getMaxDepth({ previousItem });
		const minDepth = getMinDepth({ nextItem });
		let depth = projectedDepth;

		if (projectedDepth >= maxDepth) {
			depth = maxDepth;
		} else if (projectedDepth < minDepth) {
			depth = minDepth;
		}

		const newTree = buildTree(newItems);
		setItems(newTree);
		setActiveId(null);
		setOverId(null);
	}

	function handleDragCancel() {
		setOverId(null);
		setActiveId(null);
		setOffsetLeft(0);
		setCurrentPosition(null);

		document.body.style.setProperty("cursor", "");
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
