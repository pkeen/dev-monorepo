import { SortableTree } from "@/lib/SortableTree/SortableTree";
import { courses } from "@/courses";

export default function Home() {
	// const course = courses.course.display(1);
	// console.log(course);
	return <SortableTree collapsible indicator removable={true} />;
}
