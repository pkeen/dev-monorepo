import type { db } from "@/db";
import { schema } from "@/courses";
import { faker } from "@faker-js/faker";

const markdownSamples = [
	`# Introduction to Markdown\n\nMarkdown lets you write **bold**, *italic*, and even \`code\` easily.`,
	`## Lesson Video\n\n<video controls src="https://cdn.example.com/lesson1.mp4"></video>`,
	`### Image Embed\n\n![An image](https://placehold.co/600x400)`,
	`## Code Block\n\n\`\`\`js\nconst greet = () => console.log("Hello!");\n\`\`\``,
	`## List Example\n\n- Item 1\n- Item 2\n- Item 3`,
];

const seed = async (db: db) => {
	const spoofArray = [];

	for (let i = 0; i < 60; i++) {
		const spoofData = {
			userId: Math.floor(Math.random() * 10) + 1,
			name: faker.company.buzzPhrase(),
			excerpt: faker.lorem.sentences(),
			content: `# ${faker.company.catchPhrase()}\n\n${faker.lorem.paragraph()}\n\n![Image](https://placehold.co/600x400?text=Lesson+Image)`,
			isPublished: faker.datatype.boolean(0.75),
		};
		spoofArray.push(spoofData);
	}

	try {
		await db.insert(schema.lesson).values(spoofArray);
		console.log("lessons succesfully seeded...");
	} catch (error) {
		console.error("Error inserting lessons:", error);
	}
};

export default seed;
