import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ provider: string }> }
) {
	try {
		const { provider } = await params;
		const { searchParams } = new URL(req.url);
		const callbackUrl = searchParams.get("callbackUrl") || "/";

		await signIn(provider, { redirectTo: callbackUrl });
		
		return NextResponse.redirect(callbackUrl);
	} catch (error) {
		console.error("Sign in error:", error);
		return NextResponse.redirect("/");
	}
}

