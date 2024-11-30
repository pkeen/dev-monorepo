import { handlers } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

// export const POST = async (req: NextRequest, res: any) => {
// 	return NextResponse.json({ message: "Hello World" }, { status: 200 });
// };

export const POST = handlers.refresh.POST;
