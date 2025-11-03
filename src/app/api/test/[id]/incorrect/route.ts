import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const test = await prisma.testSession.findUnique({ where: { id } });
		if (!test) return NextResponse.json({ error: "Test session not found" }, { status: 404 });

		const answers = await prisma.answer.findMany({
			where: { 
				testSessionId: id,
				correct: false, // Only incorrect answers
			},
			include: { question: true },
			orderBy: { createdAt: "asc" },
		});

		const incorrectAnswers = answers.map(a => {
			const options = JSON.parse(a.question.optionsJson);
			const correctOption = options.find((opt: any) => opt.id === a.question.correctOption);
			const selectedOptionObj = options.find((opt: any) => opt.id === a.selectedOption);
			
			// Create specific explanation based on selected answer and question
			let specificExplanation = (a.question as any).explanation || "The correct answer follows the pattern or logical reasoning.";
			
			if (a.selectedOption && selectedOptionObj) {
				// Enhance explanation to explain why the selected answer was wrong
				const selectedText = selectedOptionObj.text;
				const correctText = correctOption?.text || a.question.correctOption;
				
				specificExplanation = `${specificExplanation} You selected "${selectedText}", but the correct answer is "${correctText}". ${specificExplanation.includes("why") ? "" : "This pattern requires careful analysis of the sequence or relationship."}`;
			}
			
			return {
				questionId: a.question.id,
				questionText: a.question.text,
				selectedOption: a.selectedOption,
				selectedOptionText: selectedOptionObj?.text || a.selectedOption || "(Skipped)",
				correctOption: a.question.correctOption,
				correctOptionText: correctOption?.text || a.question.correctOption,
				explanation: specificExplanation,
				difficulty: a.question.difficulty,
				options: options, // Include all options for reference
			};
		});

		return NextResponse.json({ incorrectAnswers });
	} catch (error) {
		console.error("Error in GET /api/test/[id]/incorrect:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

