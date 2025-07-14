import type { db } from "@/db";
import { schema, courses } from "@/courses";
import { faker } from "@faker-js/faker";

const fileContentIds = async (db: db) => {
	const fileContentIds = await courses.content.list({ type: "file" });
	return fileContentIds.map((fileContent: any) => fileContent.id);
};

const createFileDetails = async (db: db) => {
	const contentIds = await fileContentIds(db);
	const fileDetails = contentIds.map((contentId: number) => {
		return {
			contentId,
			fileUrl:
				"https://pub-aadc81bf7bf946a68df634beb130c08f.r2.dev/test/1752483024589-CV_Data_Analyst_2025.pdf",
			fileName: "CV Data Analyst 2025.pdf",
			mimeType: "application/pdf",
			size: 152514,
		};
	});
	return fileDetails;
};

const seed = async (db: db) => {
	// const videoContentIds = await videoContentIds(db);
	const fileDetails = await createFileDetails(db); // adjust number of records
	try {
		await db.insert(schema.fileDetail).values(fileDetails);
		console.log("fileDetails succesfully seeded...");
	} catch (error) {
		console.error("Error inserting fileDetails:", error);
	}
};

export default seed;
