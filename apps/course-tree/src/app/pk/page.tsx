import { courses } from "@/courses";
import { flattenTree, courseDisplayToTree } from "@/lib/PkSortableTree";
import { SortableTree } from "@/lib/PkSortableTree/SortableTree";

export default async function PK() {
	const course = await courses.course.display(1);
	// console.log(course);
	const tree = courseDisplayToTree(course);
	console.log("TREE:", tree);
	// const flattenedTree = flattenTree(tree);
	// console.log("FLATTENED TREE:", flattenedTree);
	return (
		<SortableTree
			collapsible
			indicator
			removable={true}
			initialItems={tree}
		/>
	);
}
