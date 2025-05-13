import type { db } from "@/db";
import { schema } from "@/courses";
import { faker } from "@faker-js/faker";

const videoProviders = ["r2", "youtube", "vimeo", "mux", "bunny"];

// const getLessonIds = async (db: db) => {
// 	const lessonIds = db.select({ id: schema.lesson.id }).from(schema.lesson);
// 	return lessonIds;
// };

const createDummyVideos = (count = 20) => {
	const videos = [];
	for (let i = 0; i < count; i++) {
		videos.push({
			provider: faker.helpers.arrayElement(videoProviders),
			url: faker.internet.url(),
			title: faker.lorem.sentence({ min: 3, max: 8 }),
			thumbnailUrl: faker.image.urlPicsumPhotos({
				width: 640,
				height: 360,
			}),
			isPublished: faker.datatype.boolean(),
			order: faker.number.int({ min: 1, max: 10 }),
			durationSeconds: faker.number.int({ min: 60, max: 900 }),
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}
	return videos;
};

const seed = async (db: db) => {
	const videos = createDummyVideos(30); // adjust number of records
	try {
		await db.insert(schema.video).values(videos);
		console.log("videos succesfully seeded...");
	} catch (error) {
		console.error("Error inserting videos:", error);
	}
};

export default seed;
