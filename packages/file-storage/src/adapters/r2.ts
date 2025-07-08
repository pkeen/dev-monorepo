// adapters/r2.ts
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { FileStorageAdapter, FileMetadata } from "../types";

export function createR2Adapter({
	accessKeyId,
	secretAccessKey,
	bucketName,
	region = "auto",
	endpoint,
	publicBaseUrl,
}: {
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	endpoint: string;
	publicBaseUrl: string; // Used to generate public-facing URLs
	region?: string;
}): FileStorageAdapter {
	const client = new S3Client({
		region,
		endpoint,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	return {
		async upload(file, { key, contentType, name }): Promise<FileMetadata> {
			await client.send(
				new PutObjectCommand({
					Bucket: bucketName,
					Key: key,
					Body: file,
					ContentType: contentType,
				})
			);

			// Fetch file size (optional but useful)
			const head = await client.send(
				new HeadObjectCommand({ Bucket: bucketName, Key: key })
			);

			return {
				key,
				url: `${publicBaseUrl}/${key}`,
				size: head.ContentLength ?? file.length,
				type: contentType,
				name,
			};
		},

		async delete(key: string) {
			await client.send(
				new DeleteObjectCommand({ Bucket: bucketName, Key: key })
			);
		},

		getUrl(key: string) {
			return `${publicBaseUrl}/${key}`;
		},
	};
}
