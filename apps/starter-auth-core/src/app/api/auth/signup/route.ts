import { authSystem } from "@/app/auth";

export async function POST(request: Request) {
	const credentials = await request.json();
    const authState = await authSystem.signup(credentials);
    

}
