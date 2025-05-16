import { courses } from "@/courses";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
	const course = await courses.course.outline(parseInt(params.id, 10));
	if (!course) return notFound();
	return <div className="text-2xl font-bold">{course.title}</div>;
}
