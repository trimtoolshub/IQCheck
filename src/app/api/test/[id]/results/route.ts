import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRealTimeIQ } from "@/lib/adaptiveEngine";

export const runtime = "nodejs";

// Convert IQ to percentile (based on standard normal distribution)
function iqToPercentile(iq: number): number {
	// IQ follows normal distribution: mean=100, SD=15
	const z = (iq - 100) / 15;
	// Approximation of cumulative distribution function
	const percentile = 0.5 * (1 + erf(z / Math.sqrt(2))) * 100;
	return Math.max(0.1, Math.min(99.9, Math.round(percentile * 10) / 10));
}

// Error function approximation
function erf(x: number): number {
	const a1 =  0.254829592;
	const a2 = -0.284496736;
	const a3 =  1.421413741;
	const a4 = -1.453152027;
	const a5 =  1.061405429;
	const p  =  0.3275911;
	
	const sign = x < 0 ? -1 : 1;
	x = Math.abs(x);
	
	const t = 1.0 / (1.0 + p * x);
	const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
	
	return sign * y;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const test = await prisma.testSession.findUnique({ where: { id } });
		if (!test) return NextResponse.json({ error: "Test session not found" }, { status: 404 });

		const answers = await prisma.answer.findMany({
			where: { testSessionId: id },
			include: { question: true },
			orderBy: { createdAt: "asc" },
		});

		if (answers.length === 0) {
			return NextResponse.json({ 
				error: "Test not started or no answers yet",
				percentile: 50,
				iqCategory: "Average",
				accuracy: 0,
				totalQuestions: 0,
				correctAnswers: 0,
				personalityTraits: [],
				strengths: {
					verbal: 0,
					mathematical: 0,
					logical: 0,
					patternRecognition: 0,
				}
			}, { status: 200 });
		}

		const totalQuestions = answers.length;
		const correctAnswers = answers.filter(a => a.correct).length;
		const accuracy = (correctAnswers / totalQuestions) * 100;

		// Calculate real-time IQ
		const iqScore = await calculateRealTimeIQ(id);
		const percentile = iqToPercentile(iqScore);

		// Determine IQ category based on percentile
		let iqCategory = "";
		if (percentile >= 98) iqCategory = "Very Superior";
		else if (percentile >= 84) iqCategory = "Superior";
		else if (percentile >= 50) iqCategory = "High Average";
		else if (percentile >= 16) iqCategory = "Average";
		else if (percentile >= 2) iqCategory = "Low Average";
		else iqCategory = "Below Average";

		// Analyze performance patterns for personality traits
		const traits: string[] = [];
		
		// Response time analysis (if available)
		const avgResponseTime = answers.reduce((sum, a) => sum + a.responseTimeMs, 0) / totalQuestions;
		if (avgResponseTime < 5000) {
			traits.push("Quick Thinker");
		} else if (avgResponseTime > 15000) {
			traits.push("Thorough Analyzer");
		}

		// Accuracy-based traits
		if (accuracy >= 80) {
			traits.push("High Achiever");
		}
		if (accuracy >= 70 && accuracy < 80) {
			traits.push("Consistent Performer");
		}

		// Difficulty preference analysis
		const hardQuestions = answers.filter(a => a.question.difficulty >= 4);
		const hardAccuracy = hardQuestions.length > 0 
			? hardQuestions.filter(a => a.correct).length / hardQuestions.length 
			: 0;
		
		if (hardAccuracy >= 0.7) {
			traits.push("Problem Solver");
		}

		// Pattern recognition (sequence/pattern questions)
		const patternQuestions = answers.filter(a => 
			a.question.tagsJson.includes("sequence") || 
			a.question.tagsJson.includes("pattern")
		);
		const patternAccuracy = patternQuestions.length > 0
			? patternQuestions.filter(a => a.correct).length / patternQuestions.length
			: 0;
		
		if (patternAccuracy >= 0.8) {
			traits.push("Pattern Recognition Expert");
		}

		// Verbal skills
		const verbalQuestions = answers.filter(a => 
			a.question.tagsJson.includes("verbal") || 
			a.question.tagsJson.includes("vocabulary") ||
			a.question.tagsJson.includes("anagram")
		);
		const verbalAccuracy = verbalQuestions.length > 0
			? verbalQuestions.filter(a => a.correct).length / verbalQuestions.length
			: 0;
		
		if (verbalAccuracy >= 0.8) {
			traits.push("Strong Verbal Ability");
		}

		// Mathematical skills
		const mathQuestions = answers.filter(a => 
			a.question.tagsJson.includes("mathematical")
		);
		const mathAccuracy = mathQuestions.length > 0
			? mathQuestions.filter(a => a.correct).length / mathQuestions.length
			: 0;
		
		if (mathAccuracy >= 0.8) {
			traits.push("Strong Mathematical Reasoning");
		}

		// Logical reasoning
		const logicQuestions = answers.filter(a => 
			a.question.tagsJson.includes("logic") || 
			a.question.tagsJson.includes("reasoning")
		);
		const logicAccuracy = logicQuestions.length > 0
			? logicQuestions.filter(a => a.correct).length / logicQuestions.length
			: 0;
		
		if (logicAccuracy >= 0.8) {
			traits.push("Analytical Thinker");
		}

		// Consistency check
		const firstHalf = answers.slice(0, Math.ceil(answers.length / 2));
		const secondHalf = answers.slice(Math.ceil(answers.length / 2));
		const firstHalfAccuracy = firstHalf.filter(a => a.correct).length / firstHalf.length;
		const secondHalfAccuracy = secondHalf.filter(a => a.correct).length / secondHalf.length;
		
		if (Math.abs(firstHalfAccuracy - secondHalfAccuracy) < 0.1) {
			traits.push("Consistent");
		}

		// If no traits identified, add default
		if (traits.length === 0) {
			traits.push("Balanced Thinker");
		}

		// Limit to top 5 traits
		const topTraits = traits.slice(0, 5);

		return NextResponse.json({
			percentile,
			iqCategory,
			accuracy: Math.round(accuracy),
			totalQuestions,
			correctAnswers,
			personalityTraits: topTraits,
			strengths: {
				verbal: Math.round(verbalAccuracy * 100),
				mathematical: Math.round(mathAccuracy * 100),
				logical: Math.round(logicAccuracy * 100),
				patternRecognition: Math.round(patternAccuracy * 100),
			},
		});
	} catch (error) {
		console.error("Error in GET /api/test/[id]/results:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

