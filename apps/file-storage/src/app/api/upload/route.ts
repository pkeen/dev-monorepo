// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createLocalAdapter, generateFileKey } from "@pete_keen/file-storage";

const fileStorage = createLocalAdapter();

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get("file");

	if (!(file instanceof Blob)) {
		return NextResponse.json({ error: "Invalid file" }, { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	const key = generateFileKey({
		prefix: "test",
		filename: (file as File).name,
	});

	const metadata = await fileStorage.upload(buffer, {
		key,
		contentType: file.type,
		name: (file as File).name,
	});

	return NextResponse.json(metadata);
}
