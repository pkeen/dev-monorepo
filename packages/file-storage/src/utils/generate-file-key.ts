export function generateFileKey({
	prefix,
	filename,
}: {
	prefix: string;
	filename: string;
}) {
	const timestamp = Date.now();
	const slug = filename.replace(/[^a-z0-9.\-_]/gi, "_");
	return `${prefix}/${timestamp}-${slug}`;
}
