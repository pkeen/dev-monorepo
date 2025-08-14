"use client";

import { useCallback, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function FileDropzone({
	uploadUrl,
	accept = ["image/*", "application/pdf"],
	maxFiles = 1,
}: // maxFiles,

{
	uploadUrl: string;
	accept: string[];
	maxFiles: number;
}) {
	const [uploadPct, setUploadPct] = useState(0);
	const onDrop = useCallback(async (accepted: File[]) => {
		if (!accepted.length) return;
		const file = accepted[0];

		const formData = new FormData();
		formData.append("file", file);
		// formData.append("courseId", courseId);

		const res = await axios.post(uploadUrl, formData, {
			onUploadProgress: (event) => {
				if (!event.total) return;
				const percent = Math.round((event.loaded * 100) / event.total);
				setUploadPct(percent);
			},
		}); 

		// res.data would include file metadata (key, url, size, etc.)
		console.log("Uploaded:", res.data);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [] },
		maxFiles,
	});

	return (
		<Card className="p-6 w-full max-w-md">
			<CardContent
				{...getRootProps()}
				className={`border-dashed border-2 rounded-2xl flex flex-col items-center justify-center gap-2 py-10 transition-colors
          ${isDragActive ? "border-primary" : "border-muted"}`}
			>
				<input {...getInputProps()} />
				<span className="text-sm font-medium">
					{isDragActive
						? "Drop to upload"
						: "Drag files here or click"}
				</span>

				{uploadPct > 0 && (
					<Progress value={uploadPct} className="w-full mt-4" />
				)}
			</CardContent>

			<Button variant="secondary" className="mt-4" onClick={() => {}}>
				Choose file
			</Button>
		</Card>
	);
}
