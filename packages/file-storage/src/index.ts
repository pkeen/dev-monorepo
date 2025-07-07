export const hello = () => {
	console.log("Hello");
};

export * from "./types";
export * from "./adapters/local"; // export R2/S3 as you build them
export * from "./utils/generate-file-key";
