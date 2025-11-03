import { prisma } from "@/lib/prisma";

export type Domain = "IQ" | "OCD" | string;

type SelectNextQuestionParams = {
	userId?: string;
	testSessionId: string;
	domain: Domain;
};

// Calculate real-time IQ based on current answers
export async function calculateRealTimeIQ(testSessionId: string): Promise<number> {
	const answers = await prisma.answer.findMany({
		where: { testSessionId },
		include: { question: true },
		orderBy: { createdAt: "asc" },
	});

	if (answers.length === 0) {
		return 100; // Default starting IQ
	}

	const totalQuestions = answers.length;
	const correctAnswers = answers.filter(a => a.correct).length;
	const accuracy = (correctAnswers / totalQuestions) * 100;

	// Calculate IQ based on accuracy and difficulty of questions answered
	let iqScore = 100; // Base IQ
	
	// Weight by difficulty: harder questions correct = higher IQ
	const difficultyPoints = answers.reduce((sum, a) => {
		if (a.correct) {
			return sum + (a.question.difficulty * 8); // Points for correct answers
		} else {
			return sum - (a.question.difficulty * 2); // Penalty for wrong answers
		}
	}, 0);
	
	// Calculate average difficulty answered correctly
	const correctByDifficulty = answers.filter(a => a.correct).reduce((sum, a) => sum + a.question.difficulty, 0);
	const avgCorrectDifficulty = answers.filter(a => a.correct).length > 0 
		? correctByDifficulty / answers.filter(a => a.correct).length 
		: 0;

	// IQ calculation: base + accuracy bonus + difficulty bonus
	iqScore += (accuracy - 50) * 0.8; // Accuracy contributes
	iqScore += (avgCorrectDifficulty - 3) * 15; // Difficulty level contributes
	iqScore += difficultyPoints / totalQuestions; // Weighted difficulty points
	
	// Clamp IQ between 70 and 160
	iqScore = Math.max(70, Math.min(160, Math.round(iqScore)));
	
	return iqScore;
}

// Convert IQ to difficulty level (IQ range 70-160 maps to difficulty 1-5)
function iqToDifficulty(iq: number): number {
	if (iq >= 130) return 5; // Very high IQ -> hardest questions
	if (iq >= 115) return 4; // High IQ -> hard questions
	if (iq >= 100) return 3; // Average IQ -> medium questions
	if (iq >= 85) return 2;  // Low average -> easy-medium
	return 1; // Low IQ -> easiest questions
}

export async function selectNextQuestion({ userId, testSessionId, domain }: SelectNextQuestionParams) {
	const answered = await prisma.answer.findMany({
		where: { testSessionId },
		select: { questionId: true, correct: true },
		orderBy: { createdAt: "desc" },
	});

	// Limit test to 20 questions max
	const MAX_QUESTIONS = 20;
	if (answered.length >= MAX_QUESTIONS) {
		return null; // Test complete
	}

	// Calculate real-time IQ to determine appropriate difficulty
	const realTimeIQ = await calculateRealTimeIQ(testSessionId);
	let targetDifficulty = iqToDifficulty(realTimeIQ);

	// Fine-tune based on last answer (for immediate feedback)
	const last = answered[0];
	if (last) {
		const lastQuestion = await prisma.question.findUnique({ where: { id: last.questionId } });
		if (lastQuestion) {
			if (last.correct && lastQuestion.difficulty === targetDifficulty) {
				// If correct at target level, challenge slightly harder
				targetDifficulty = Math.min(5, targetDifficulty + 1);
			} else if (!last.correct && lastQuestion.difficulty >= targetDifficulty) {
				// If wrong at or above target, give easier
				targetDifficulty = Math.max(1, targetDifficulty - 1);
			}
		}
	}
	
	let currentDifficulty = targetDifficulty;

	const excludeIds = answered.map(a => a.questionId);

	// Get all candidates that match difficulty range
	const candidates = await prisma.question.findMany({
		where: {
			domain,
			id: { notIn: excludeIds },
			difficulty: { gte: currentDifficulty - 1, lte: currentDifficulty + 1 },
		},
	});

	if (candidates.length === 0) {
		// If no candidates in range, expand search
		const allCandidates = await prisma.question.findMany({
			where: {
				domain,
				id: { notIn: excludeIds },
			},
		});
		
		if (allCandidates.length === 0) {
			return null; // No more questions available
		}
		
		// Return random question from remaining
		const randomIndex = Math.floor(Math.random() * allCandidates.length);
		return allCandidates[randomIndex];
	}

	// Prioritize least exposed questions, but add randomness
	candidates.sort((a, b) => {
		if (a.exposureCount !== b.exposureCount) {
			return a.exposureCount - b.exposureCount;
		}
		// If exposure count is same, prefer current difficulty level
		const aDiff = Math.abs(a.difficulty - currentDifficulty);
		const bDiff = Math.abs(b.difficulty - currentDifficulty);
		if (aDiff !== bDiff) {
			return aDiff - bDiff;
		}
		// Finally, randomize among equal candidates
		return Math.random() - 0.5;
	});

	// Select from top 50% least exposed candidates (adds randomization)
	const topCandidates = candidates.slice(0, Math.max(1, Math.ceil(candidates.length * 0.5)));
	const randomIndex = Math.floor(Math.random() * topCandidates.length);
	return topCandidates[randomIndex];
}

export async function recordAnswer(params: {
	userId?: string;
	testSessionId: string;
	questionId: string;
	selectedOption: string;
	responseTimeMs: number;
}) {
	const q = await prisma.question.findUnique({ where: { id: params.questionId } });
	if (!q) throw new Error("Question not found");
	// Empty selectedOption means skipped/not answered - mark as incorrect
	const correct = params.selectedOption ? q.correctOption === params.selectedOption : false;
	await prisma.answer.create({
		data: {
			userId: params.userId,
			testSessionId: params.testSessionId,
			questionId: params.questionId,
			selectedOption: params.selectedOption,
			correct,
			responseTimeMs: params.responseTimeMs,
		},
	});
	await prisma.question.update({ where: { id: q.id }, data: { exposureCount: { increment: 1 } } });
	return { correct };
}



