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

	// Optional helpers
	fileExists?(key: string): Promise<boolean>;
	getMetadata?(key: string): Promise<FileMetadata>;
	list?(prefix: string): Promise<string[]>;
	generatePresignedUrl?(key: string, expiresIn?: number): Promise<string>;
	deleteMany?(keys: string[]): Promise<void>;
}
