"use client";
import React, { useState } from "react";
import {
	SimpleTreeItemWrapper,
	SortableTree,
	TreeItemComponentProps,
	TreeItems,
} from "dnd-kit-sortable-tree";

export default function SortableTreeExample() {
	const [items, setItems] = useState(initialViableMinimalData);
	return (
		<SortableTree
			items={items}
			onItemsChanged={setItems}
			TreeItemComponent={TreeItem}
			// canRootHaveChildren={(item) => item.type === "Course"}
			// canHaveChildren={(item) => item.type === "Course"}
			indentationWidth={50}
		/>
	);
}

type MinimalTreeItemData = {
	value: string;
	type: string;
};
/*
 * Here's the component that will render a single row of your tree
 */
const TreeItem = React.forwardRef<
	HTMLDivElement,
	TreeItemComponentProps<MinimalTreeItemData>
>((props, ref) => {
	const [sample, setSample] = useState("");
	return (
		<SimpleTreeItemWrapper
			{...props}
			ref={ref}
			// canHaveChildren={(item) => item.type === "Course"}
		>
			<div>{props.item.value}</div>
			<input
				value={sample}
				onChange={(e) => {
					setSample(e.target.value);
				}}
			></input>
		</SimpleTreeItemWrapper>
	);
});
/*
 * Configure the tree data.
 */
const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
	{
		id: 1,
		value: "Course",
		type: "Course",
		children: [
			{ id: 4, value: "Module", type: "Module" },
			{ id: 5, value: "Lesson", type: "Lesson" },
		],
	},
	{
		id: 2,
		value: "Course 1",
		type: "Course",
		children: [{ id: 6, value: "Module 1", type: "Module" }],
	},
	{ id: 3, value: "Course 2", type: "Course" },
];
