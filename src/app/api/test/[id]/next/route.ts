import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { selectNextQuestion } from "@/lib/adaptiveEngine";

export const runtime = "nodejs";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		let session = null;
		if (typeof auth === 'function') {
			try {
				session = await auth();
			} catch (authError) {
				console.warn("Auth failed, continuing without session:", authError);
			}
		}
		const test = await prisma.testSession.findUnique({ where: { id } });
		if (!test) return NextResponse.json({ error: "Test session not found" }, { status: 404 });
		
		// Check if questions exist in database
		const questionCount = await prisma.question.count({ where: { domain: "IQ" } });
		if (questionCount === 0) {
			return NextResponse.json({ 
				error: "No questions available. Please seed the database first." 
			}, { status: 500 });
		}
		
		const q = await selectNextQuestion({
			userId: session?.user?.id,
			testSessionId: test.id,
			domain: "IQ",
		});
		
		if (!q) {
			// Check how many questions were answered
			const answeredCount = await prisma.answer.count({ where: { testSessionId: test.id } });
			return NextResponse.json({ 
				done: true,
				message: `Test complete. Answered ${answeredCount} questions.`
			});
		}
		
		try {
			const options = JSON.parse(q.optionsJson);
			return NextResponse.json({
				question: {
					id: q.id,
					text: q.text,
					options: options,
					difficulty: q.difficulty,
				},
			});
		} catch (parseError) {
			console.error("Failed to parse options JSON:", parseError);
			return NextResponse.json({ error: "Invalid question data" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error in GET /api/test/[id]/next:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}


