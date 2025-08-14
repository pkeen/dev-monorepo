import { FileDropzone } from "@/lib/components/FileDropzone";
import { UploadPage } from "@/lib/components/Upload";

export default function Page() {
	return (
		<>
			<UploadPage />
			<FileDropzone
				uploadUrl="/api/upload"
				accept={["image/*"]}
				maxFiles={1}
			/>
		</>
	);
}
