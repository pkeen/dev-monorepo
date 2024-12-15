import { loadEnv } from "./loadEnv";
import { jwt } from "@/lib/auth/utils";
// import { config } from "dotenv";

// config();
loadEnv();

// script to check output of jwt promise etc
// may be turned into test later

async function main() {
	// ok so lets sign on first to test:
	const payload = { hello: "world" };
	const token = await jwt.signToken(payload);
	// const token =
	// 	// "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjJkNTE4YmE4LTNjYjYtNDRhZi04ZjNmLTljZTc5YmExMWI4YyIsImVtYWlsIjoicGtlZW43QGdtYWlsLmNvbSIsImlhdCI6MTczMjMxMDIyMywiXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIiwiYXVkIjoidXJuOmV4YW1wbGU6YXVkaWVuY2UiLCJleHAiOjE3MzIzMTc0MjN9.VZ_TB4pHsQIAjA3C3Brzul42bHqAP8pKYbGQRiaKL6c"; // invalid signature
	//  "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjJkNTE4YmE4LTNjYjYtNDRhZi04ZjNmLTljZTc5YmExMWI4YyIsImVtYWlsIjoicGtlZW43QGdtYWlsLmNvbSIsImlhdCI6MTczMjMxMDIyMywiaXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIiwiYXVkIjoidXJuOmV4YW1wbGU6YXVkaWVuY2UiLCJleHAiOjE3MzIzMTc0MjN9.fgf9VBgrpBj_M8AS_XP9IIqMq-v34IpFMxQowQdpCZc"; // expired token

	// set time out here for 1.5 seconds so it expires
	// Wait for just over 1 second (1.5 seconds)
	// await new Promise((resolve) => setTimeout(resolve, 1200));

	const decoded = jwt.verifyToken(token).then((result) => {
		console.log("result:", result);
		return result;
	});

	return decoded;

	// console.log("payload:", payload);
}

main();
