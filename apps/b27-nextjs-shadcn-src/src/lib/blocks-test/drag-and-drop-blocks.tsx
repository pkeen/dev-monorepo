// DragAndDropBlocks.tsx
// A fully‑typed React component that allows blocks to be reordered at the top level *and* nested
// into one another using **dnd‑kit**.  shadcn/ui components are used for styling, and
// react‑hook‑form is integrated so each block can expose its own mini‑form.
// ---------------------------------------------------------------------------
// 👉  Usage quick‑start (Vite / Next.js)
// 1.  Install deps:
//     pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers
//     pnpm add react-hook-form @hookform/resolvers zod
//     pnpm add nanoid clsx
// 2.  Make sure you have **shadcn/ui** installed and generated (`npx shadcn-ui@latest init`).
// 3.  Drop this file anywhere in your project and render <DragAndDropBlocks />.
// 4.  Each block is a <Card>.  Click the “＋” button to add a nested block.
// 5.  Drag a block by its grab handle (☰).  Drop *onto* a sibling’s body to nest it; drop between
//     siblings to reorder within that level.
// ---------------------------------------------------------------------------
// ❗  This example focuses on the *data structure* and *interaction model* rather than visual polish.
// ---------------------------------------------------------------------------
"use client";
import React, { useState, useCallback } from "react";
import {
	DndContext,
	closestCenter,
	DragEndEvent,
	UniqueIdentifier,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	defaultAnimateLayoutChanges,
	arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { nanoid } from "nanoid";
import clsx from "clsx";

// ------------------------ Types & Utilities ------------------------ //

export interface Block {
	/** Unique ID understood by dnd‑kit. */
	id: UniqueIdentifier;
	/** Optional friendly label. */
	label: string;
	/** Children – allows for infinite nesting */
	children: Block[];
}

/** Convenience: generate an empty block skeleton */
const createBlock = (label = "Untitled block"): Block => ({
	id: nanoid(),
	label,
	children: [],
});

/** Walk the tree and find a block by id.  Returns the *parent* and the index where found. */
function findBlock(
	tree: Block[],
	id: UniqueIdentifier
): { parent: Block[]; index: number } | null {
	for (let i = 0; i < tree.length; i++) {
		if (tree[i].id === id) return { parent: tree, index: i };
		const childSearch = findBlock(tree[i].children, id);
		if (childSearch) return childSearch;
	}
	return null;
}

// ------------------------ Sortable Block Component ------------------------ //

interface SortableBlockProps {
	block: Block;
	depth: number;
}

const SortableBlock: React.FC<SortableBlockProps> = ({ block, depth }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: block.id,
		animateLayoutChanges: defaultAnimateLayoutChanges,
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : undefined,
	};

	// Form for editing the label – keeps example self‑contained
	const { control, handleSubmit } = useForm<{ label: string }>({
		defaultValues: { label: block.label },
	});

	const onSubmit = (data: { label: string }) => {
		/* no‑op – update happens upstream in a real app */
		console.info("Update label: ", data);
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={clsx("space-y-2", depth && "ml-4")}
			{...attributes}
		>
			<Card className="relative">
				<CardHeader className="flex flex-row items-center gap-2 py-2 px-3">
					<span
						{...listeners}
						className="cursor-grab active:cursor-grabbing text-muted-foreground"
					>
						<GripVertical size={16} />
					</span>
					<form onBlur={handleSubmit(onSubmit)} className="flex-1">
						<Controller
							name="label"
							control={control}
							render={({ field }) => (
								<input
									{...field}
									className="bg-transparent outline-none w-full text-base"
								/>
							)}
						/>
					</form>
					{/* Add nested block */}
					<Button
						variant="ghost"
						size="icon"
						type="button"
						className="h-6 w-6"
						onClick={(e) => {
							e.stopPropagation();
							/* handled higher level via custom event */
							document.dispatchEvent(
								new CustomEvent("add-child", {
									detail: { parentId: block.id },
								})
							);
						}}
					>
						<Plus size={14} />
					</Button>
				</CardHeader>
				{/* The block body → droppable context for children */}
				<CardContent className="pb-4 pt-0">
					<SortableContext
						items={block.children.map((c) => c.id)}
						strategy={verticalListSortingStrategy}
					>
						{block.children.map((child) => (
							<SortableBlock
								key={child.id}
								block={child}
								depth={depth + 1}
							/>
						))}
					</SortableContext>
				</CardContent>
			</Card>
		</div>
	);
};

// ------------------------ Main Component ------------------------ //

export const DragAndDropBlocks: React.FC = () => {
	const [blocks, setBlocks] = useState<Block[]>(() => [
		createBlock("Heading"),
		createBlock("Paragraph"),
		createBlock("Image"),
	]);

	// Listen for add‑child events bubbled up from SortableBlock
	React.useEffect(() => {
		const addChild = (e: Event) => {
			const { parentId } = (
				e as CustomEvent<{ parentId: UniqueIdentifier }>
			).detail;
			setBlocks((prev) => {
				const draft = structuredClone(prev);
				const res = findBlock(draft, parentId);
				if (res) {
					res.parent[res.index].children.push(createBlock("Nested"));
				}
				return draft;
			});
		};
		document.addEventListener("add-child", addChild);
		return () => document.removeEventListener("add-child", addChild);
	}, []);

	// DnD sensors
	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setBlocks((prev) => {
			const next = structuredClone(prev);
			const from = findBlock(next, active.id);
			const to = findBlock(next, over.id);
			if (!from) return prev;

			// ----- remove active from its old location ----- //
			const [moved] = from.parent.splice(from.index, 1);

			if (!to) {
				// Top‑level move (shouldn't happen)
				next.push(moved);
				return next;
			}

			// If hovering over a *block*, insert as its last child.
			// Holding Shift while dropping → insert as sibling *above* (simple demo UX)
			const isNestedDrop = !event.active.data.current?.shiftKey; // crude demo
			if (isNestedDrop) {
				to.parent[to.index].children.push(moved);
			} else {
				// sibling reorder within same level
				const targetSiblings = to.parent;
				const newIndex = to.index + 1; // place after target
				targetSiblings.splice(newIndex, 0, moved);
			}
			return next;
		});
	}, []);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div className="space-y-2 max-w-xl mx-auto py-8">
				<SortableContext
					items={blocks.map((b) => b.id)}
					strategy={verticalListSortingStrategy}
				>
					{blocks.map((block) => (
						<SortableBlock key={block.id} block={block} depth={0} />
					))}
				</SortableContext>
				<Button
					className="mt-4 w-full"
					onClick={() =>
						setBlocks((b) => [...b, createBlock("New block")])
					}
				>
					Add top‑level block
				</Button>
			</div>
		</DndContext>
	);
};

export default DragAndDropBlocks;
