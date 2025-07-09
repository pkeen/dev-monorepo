import { createR2Adapter } from "@pete_keen/file-storage"; // adjust path
import * as fs from "fs/promises";
import * as path from "path";
import { config } from "dotenv";
// import "dotenv/config";

config({ path: path.resolve(process.cwd(), ".env") });
console.log("Bucket:", process.env.R2_BUCKET_NAME);
// WE HAVE A ENV PROBLEM CURRENTLY

const storage = createR2Adapter({
	accessKeyId: process.env.R2_ACCESS_KEY!,
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	bucketName: process.env.R2_BUCKET_NAME!,
	endpoint: process.env.R2_ENDPOINT!,
	publicBaseUrl: process.env.R2_PUBLIC_BASE_URL!,
});

async function run() {
	const filePath = path.resolve(__dirname, "test.png"); // change to any file you have
	const buffer = await fs.readFile(filePath);

	const metadata = await storage.upload(buffer, {
		key: `test/${Date.now()}-test.png`,
		contentType: "image/png",
		name: "test.png",
	});

	console.log("Upload complete:");
	console.log(metadata);
}

run().catch((err) => {
	console.error("Error uploading file:", err);
});
