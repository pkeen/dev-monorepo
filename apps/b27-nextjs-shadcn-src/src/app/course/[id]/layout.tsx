import { CourseLayout } from "@/lib/components/course-display/course-layout";
import {
	CourseOutline,
	CourseSlotDeepOutline,
} from "@pete_keen/courses/validators";
import { MinimalHeader } from "@/lib/components";
import { thia } from "@/auth";
import { courses } from "@/courses";
import { notFound } from "next/navigation";
import { Sidebar } from "@/lib/components/course-display/sidebar";

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { id: string };
}) {
	const user = await thia();
	const { id } = await params;
	const course = await courses.course.deepOutline(parseInt(id, 10));
	if (!course) return notFound();
	return (
		<CourseLayout
			header={<MinimalHeader user={user} />}
			sidebar={<Sidebar slots={course.slots} />}
			footer={null}
			children={children}
		/>
	);
}
