import { describe, it, expect } from "vitest";
import { createR2Adapter } from "../src/adapters/r2";
import { randomUUID } from "crypto";

const storage = createR2Adapter({
	accessKeyId: process.env.R2_ACCESS_KEY!,
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	bucketName: process.env.R2_BUCKET_NAME!,
	endpoint: process.env.R2_ENDPOINT!,
	publicBaseUrl: process.env.R2_PUBLIC_BASE_URL!,
});

const testKey = `test/${randomUUID()}.txt`;
const fileContent = Buffer.from("Hello from test");
const contentType = "text/plain";

describe("R2 Adapter", () => {
	it("uploads a file", async () => {
		const result = await storage.upload(fileContent, {
			key: testKey,
			contentType,
			name: "hello.txt",
		});

		expect(result.url).toContain(testKey);
		expect(result.size).toBe(fileContent.length);
	});

	it("confirms file exists", async () => {
		const exists = await storage.fileExists!(testKey);
		expect(exists).toBe(true);
	});

	it("fetches metadata", async () => {
		const meta = await storage.getMetadata!(testKey);
		expect(meta.type).toBe(contentType);
		expect(meta.size).toBe(fileContent.length);
	});

	it("lists files by prefix", async () => {
		const files = await storage.list!("test/");
		expect(files).toContain(testKey);
	});

	it("deletes a file", async () => {
		await storage.delete(testKey);
		const exists = await storage.fileExists!(testKey);
		expect(exists).toBe(false);
	});
});
