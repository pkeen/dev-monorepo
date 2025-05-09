"use server";
import { courses } from "@/courses";

export async function deleteCourse(courseId: number) {
	try {
		await courses.course.destroy(courseId);
	} catch (err) {
		console.error(err);
		throw new Error("Something went wrong deleting the course.");
	}
}
