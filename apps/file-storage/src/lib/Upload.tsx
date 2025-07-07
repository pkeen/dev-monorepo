"use client";

import { useState } from "react";

export function UploadPage() {
	const [result, setResult] = useState<any>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = new FormData(e.target as HTMLFormElement);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: form,
		});

		const data = await res.json();
		setResult(data);
	};

	return (
		<div>
			<h1>Upload File</h1>
			<form onSubmit={handleSubmit}>
				<input type="file" name="file" required />
				<button type="submit">Upload</button>
			</form>

			{result && (
				<div>
					<p>
						Uploaded to:{" "}
						<a href={result.url} target="_blank" rel="noreferrer">
							{result.url}
						</a>
					</p>
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
