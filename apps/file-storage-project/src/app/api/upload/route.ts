// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
	createLocalAdapter,
	createR2Adapter,
	generateFileKey,
} from "@pete_keen/file-storage";

const storage = createR2Adapter({
	accessKeyId: process.env.R2_ACCESS_KEY!,
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	bucketName: process.env.R2_BUCKET_NAME!,
	endpoint: process.env.R2_ENDPOINT!,
	publicBaseUrl: process.env.R2_PUBLIC_BASE_URL!,
});

export async function POST(req: NextRequest) {
	console.log("CT:", req.headers.get("content-type"));
	// Should be auth protected
	// User Ids to create directories?
	const formData = await req.formData();
	const file = formData.get("file");

	if (!file || !(file instanceof File) || !(file instanceof Blob)) {
		return NextResponse.json(
			{ error: "No file uploaded or invalid file type" },
			{ status: 400 }
		);
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	const key = generateFileKey({
		prefix: "test",
		filename: (file as File).name,
	});

	const metadata = await storage.upload(buffer, {
		key,
		contentType: file.type,
		name: (file as File).name,
	});

	return NextResponse.json(metadata);
}
