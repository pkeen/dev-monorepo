import fs from "fs/promises";
import path from "path";
import { FileStorageAdapter, FileMetadata } from "../types";

const BASE_DIR = path.resolve(process.cwd(), "public", "uploads");

export function createLocalAdapter(
	baseUrl: string = "http://localhost:3000/uploads"
): FileStorageAdapter {
	return {
		async upload(file, { key, contentType, name }): Promise<FileMetadata> {
			const fullPath = path.join(BASE_DIR, key);
			await fs.mkdir(path.dirname(fullPath), { recursive: true });
			await fs.writeFile(fullPath, file);

			return {
				key,
				url: `${baseUrl}/${key}`,
				size: file.length,
				type: contentType,
				name,
			};
		},

		async delete(key) {
			const fullPath = path.join(BASE_DIR, key);
			await fs.unlink(fullPath).catch(() => {}); // ignore if not found
		},

		getUrl(key) {
			return `${baseUrl}/${key}`;
		},
	};
}
