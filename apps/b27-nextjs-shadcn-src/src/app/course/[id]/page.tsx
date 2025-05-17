import { courses } from "@/courses";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = await params;
	const course = await courses.course.deepOutline(parseInt(id, 10));
	if (!course) return notFound();
	return <div className="text-2xl font-bold">{course.title}</div>;
}
