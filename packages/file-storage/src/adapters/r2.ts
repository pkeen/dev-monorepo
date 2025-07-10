// adapters/r2.ts
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
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

		/*
		 * Optionals
		 */

		async fileExists(key: string): Promise<boolean> {
			try {
				await client.send(
					new HeadObjectCommand({ Bucket: bucketName, Key: key })
				);
				return true;
			} catch (err: any) {
				if (err.$metadata?.httpStatusCode === 404) return false;
				throw err; // bubble up other errors
			}
		},

		async getMetadata(key: string): Promise<FileMetadata> {
			const result = await client.send(
				new HeadObjectCommand({ Bucket: bucketName, Key: key })
			);

			return {
				key,
				url: `${publicBaseUrl}/${key}`,
				size: result.ContentLength ?? 0,
				type: result.ContentType ?? "application/octet-stream",
				name:
					result.Metadata?.["original-name"] ?? key.split("/").pop()!,
			};
		},
        
		async list(prefix: string): Promise<string[]> {
			const result = await client.send(
				new ListObjectsV2Command({
					Bucket: bucketName,
					Prefix: prefix,
				})
			);

			return (
				result.Contents?.map((obj) => obj.Key!).filter(Boolean) ?? []
			);
		},
	};
}
