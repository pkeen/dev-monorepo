// Component taht would be the form that holds the sortable tree
"use client";
import { CourseTreeDTO } from "@pete_keen/courses/validators";
import { useState, useEffect } from "react";
import { SortableTree } from "./PkSortableTree";

export function CoursesForm({ course }: { course: CourseTreeDTO }) {
	const [items, setItems] = useState(course.items);

	useEffect(() => {
		console.log("Updated items:", items);
	}, [items]);

	return (
		<SortableTree
			items={items}
			onChange={setItems}
			indicator={true}
			removable={true}
			collapsible={true}
			indentationWidth={50}
		/>
	);
}
