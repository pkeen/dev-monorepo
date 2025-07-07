export type FileMetadata = {
	key: string;
	url: string;
	size: number;
	type: string;
	name: string;
};

export interface FileStorageAdapter {
	upload(
		file: Buffer,
		options: { key: string; contentType: string; name: string }
	): Promise<FileMetadata>;

	delete(key: string): Promise<void>;

	getUrl(key: string): string;
}

