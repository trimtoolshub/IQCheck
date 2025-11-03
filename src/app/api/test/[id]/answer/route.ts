import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recordAnswer } from "@/lib/adaptiveEngine";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	let session = null;
	if (typeof auth === 'function') {
		try {
			session = await auth();
		} catch (authError) {
			console.warn("Auth failed, continuing without session:", authError);
		}
	}
	const { questionId, selectedOption, responseTimeMs } = await req.json();
	if (!questionId) {
		return NextResponse.json({ error: "Missing questionId" }, { status: 400 });
	}
	
	// Handle skipped questions (empty selectedOption)
	const finalSelectedOption = selectedOption || "";
	
	const result = await recordAnswer({
		userId: session?.user?.id,
		testSessionId: id,
		questionId,
		selectedOption: finalSelectedOption,
		responseTimeMs: responseTimeMs ?? 0,
	});
	return NextResponse.json({ correct: result.correct });
}


