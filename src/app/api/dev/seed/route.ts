import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const force = searchParams.get("force") === "true";
		
		const count = await prisma.question.count();
		if (count > 0 && !force) {
			return NextResponse.json({ inserted: 0, message: "Questions already exist. Use ?force=true to reseed." });
		}
		
		if (force && count > 0) {
			await prisma.answer.deleteMany({});
			await prisma.question.deleteMany({});
		}
		
		const result = await prisma.question.createMany({
		data: [
			// Pattern Recognition Questions
			{
				text: "What comes next in the sequence: 🔵, 🔴, 🔵, 🔴, 🔵, ?",
				domain: "IQ",
				difficulty: 1,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🔴" },
					{ id: "B", text: "🔵" },
					{ id: "C", text: "🟢" },
					{ id: "D", text: "🟡" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "colors"]),
				explanation: "The pattern alternates between blue and red. After blue, the next should be red.",
			},
			{
				text: "Complete the pattern: △, □, ○, △, □, ?",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "○" },
					{ id: "B", text: "△" },
					{ id: "C", text: "□" },
					{ id: "D", text: "◇" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "shapes"]),
				explanation: "The sequence repeats triangle, square, circle. After square, the next shape is circle.",
			},
			{
				text: "Which pattern follows the rule: 🟦🟦🟥, 🟦🟥🟦, 🟥🟦🟦, ?",
				domain: "IQ",
				difficulty: 3,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🟦🟦🟦" },
					{ id: "B", text: "🟥🟥🟦" },
					{ id: "C", text: "🟥🟦🟥" },
					{ id: "D", text: "🟦🟦🟥" },
				]),
				correctOption: "C",
				tagsJson: JSON.stringify(["pattern", "logical", "colors"]),
				explanation: "The red square moves one position to the right in each step. Next pattern should have red in the middle position.",
			},
			{
				text: "What comes next: ▲▲, ▲●▲, ▲●●▲, ??",
				domain: "IQ",
				difficulty: 3,
				optionsJson: JSON.stringify([
					{ id: "A", text: "▲●●●▲" },
					{ id: "B", text: "▲●▲●▲" },
					{ id: "C", text: "●▲▲●" },
					{ id: "D", text: "▲▲▲▲" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence"]),
				explanation: "The pattern shows triangles with increasing circles between them: 0, 1, 2 circles. Next should have 3 circles.",
			},
			{
				text: "Which shape does NOT follow the pattern: 🔺🔺🔺, 🔻🔻🔻, ◼◼◼, 🔵🔵🔵",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🔺🔺🔺" },
					{ id: "B", text: "🔻🔻🔻" },
					{ id: "C", text: "◼◼◼" },
					{ id: "D", text: "🔵🔵🔵" },
				]),
				correctOption: "D",
				tagsJson: JSON.stringify(["pattern", "categorization", "shapes"]),
				explanation: "The first three are geometric shapes (triangles and squares), while the circle is a different geometric category.",
			},
			{
				text: "Complete the series: 2, 6, 12, 20, 30, ?",
				domain: "IQ",
				difficulty: 3,
				optionsJson: JSON.stringify([
					{ id: "A", text: "40" },
					{ id: "B", text: "42" },
					{ id: "C", text: "44" },
					{ id: "D", text: "50" },
				]),
				correctOption: "B",
				tagsJson: JSON.stringify(["sequence", "pattern", "mathematical"]),
				explanation: "The differences increase by 2 each time: +4, +6, +8, +10, so next is +12, making 30+12=42.",
			},
			{
				text: "What pattern is next: ↑→↓←, →↓←↑, ↓←↑→, ?",
				domain: "IQ",
				difficulty: 4,
				optionsJson: JSON.stringify([
					{ id: "A", text: "←↑→↓" },
					{ id: "B", text: "↑→↓←" },
					{ id: "C", text: "→↑←↓" },
					{ id: "D", text: "↓→↑←" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "spatial"]),
				explanation: "The arrows shift one position clockwise in each sequence. After ↓←↑→, the next should be ←↑→↓.",
			},
			{
				text: "Which sequence follows the rule: 🔴🟡, 🟡🟢, 🟢🔵, ??",
				domain: "IQ",
				difficulty: 3,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🔵🟣" },
					{ id: "B", text: "🔵🔴" },
					{ id: "C", text: "🟢🟡" },
					{ id: "D", text: "🟣🔴" },
				]),
				correctOption: "B",
				tagsJson: JSON.stringify(["pattern", "sequence", "colors"]),
				explanation: "Each pair transitions through the color spectrum. After blue, it cycles back to red, forming 🔵🔴.",
			},
			// Shape Recognition
			{
				text: "What shape comes next: ⬟, ⬟⬟, ⬟⬟⬟, ??",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "⬟⬟⬟⬟" },
					{ id: "B", text: "⬟⬟" },
					{ id: "C", text: "⬟" },
					{ id: "D", text: "⬟⬟⬟⬟⬟" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "shapes"]),
				explanation: "The number of pentagons increases by one each time: 1, 2, 3, so next is 4.",
			},
			{
				text: "Which pattern is correct: ◉◯●, ◯●◉, ●◉◯, ??",
				domain: "IQ",
				difficulty: 4,
				optionsJson: JSON.stringify([
					{ id: "A", text: "◉◯●" },
					{ id: "B", text: "◯●◉" },
					{ id: "C", text: "●◉◯" },
					{ id: "D", text: "◯◉●" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "logical"]),
				explanation: "The pattern cycles through all three circle types, repeating after three. The fourth sequence returns to the first pattern.",
			},
			// Logical Reasoning
			{
				text: "If 🟥 means 'before' and 🟦 means 'after', what does 🟥🟦🟥 mean?",
				domain: "IQ",
				difficulty: 4,
				optionsJson: JSON.stringify([
					{ id: "A", text: "Before after before" },
					{ id: "B", text: "After before after" },
					{ id: "C", text: "Middle" },
					{ id: "D", text: "Cannot determine" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["logical", "symbolic", "reasoning"]),
				explanation: "Following the symbol meanings: 🟥🟦🟥 translates directly to 'before after before'.",
			},
			{
				text: "Which number completes: 1, 4, 9, 16, 25, ?",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "30" },
					{ id: "B", text: "36" },
					{ id: "C", text: "40" },
					{ id: "D", text: "45" },
				]),
				correctOption: "B",
				tagsJson: JSON.stringify(["sequence", "pattern", "mathematical"]),
				explanation: "This is the sequence of perfect squares: 1², 2², 3², 4², 5², so next is 6² = 36.",
			},
			{
				text: "What comes next: 🔵🟢🔴, 🟢🔴🟡, 🔴🟡🟠, ??",
				domain: "IQ",
				difficulty: 4,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🟡🟠🟣" },
					{ id: "B", text: "🟠🟣🔵" },
					{ id: "C", text: "🟣🔵🟢" },
					{ id: "D", text: "🔵🟢🔴" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "colors"]),
				explanation: "Each sequence shifts one position to the right and introduces the next color in the spectrum. After 🔴🟡🟠, next is 🟡🟠🟣.",
			},
			{
				text: "Complete: ▲●■, ●■▲, ■▲●, ??",
				domain: "IQ",
				difficulty: 3,
				optionsJson: JSON.stringify([
					{ id: "A", text: "▲●■" },
					{ id: "B", text: "●■▲" },
					{ id: "C", text: "■▲●" },
					{ id: "D", text: "▲■●" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "logical"]),
				explanation: "The pattern cycles through all three symbols by shifting left. After three sequences, it repeats, so next is ▲●■.",
			},
			{
				text: "What follows: 🔴🔵🔴🔵, 🔵🟢🔵🟢, 🟢🟡🟢🟡, ??",
				domain: "IQ",
				difficulty: 4,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🟡🟠🟡🟠" },
					{ id: "B", text: "🟠🟣🟠🟣" },
					{ id: "C", text: "🟣🔴🟣🔴" },
					{ id: "D", text: "🟡🔴🟡🔴" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "colors"]),
				explanation: "Each sequence shows alternating colors progressing through the spectrum. After 🟢🟡🟢🟡, next follows with 🟡🟠🟡🟠.",
			},
			{
				text: "Which is the odd one: 🟦🟦🟦, 🟥🟥🟥, 🟨🟨🟨, 🟩🟩🟩🟩",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🟦🟦🟦" },
					{ id: "B", text: "🟥🟥🟥" },
					{ id: "C", text: "🟨🟨🟨" },
					{ id: "D", text: "🟩🟩🟩🟩" },
				]),
				correctOption: "D",
				tagsJson: JSON.stringify(["pattern", "categorization", "logical"]),
				explanation: "The first three have three squares each, while the last has four squares, making it the odd one out.",
			},
			{
				text: "What pattern: ▲▲▲, ▼▼▼, ▲▲▲, ??",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "▼▼▼" },
					{ id: "B", text: "▲▲▲" },
					{ id: "C", text: "▲▼▲" },
					{ id: "D", text: "▼▲▼" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence"]),
				explanation: "The pattern alternates between three up triangles and three down triangles. After ▲▲▲, next should be ▼▼▼.",
			},
			{
				text: "Complete: ●●●, ●●○, ●○○, ??",
				domain: "IQ",
				difficulty: 3,
				optionsJson: JSON.stringify([
					{ id: "A", text: "○○○" },
					{ id: "B", text: "●○○" },
					{ id: "C", text: "●●○" },
					{ id: "D", text: "●●●" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "logical"]),
				explanation: "Each step replaces one filled circle with an empty circle from left to right. After ●○○, next is ○○○.",
			},
			{
				text: "What comes next: 🔵🟢, 🟢🔵, 🔵🟢, ??",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🟢🔵" },
					{ id: "B", text: "🔵🟢" },
					{ id: "C", text: "🔵🔵" },
					{ id: "D", text: "🟢🟢" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "colors"]),
				explanation: "The pattern alternates between 🔵🟢 and 🟢🔵. After 🔵🟢, next should be 🟢🔵.",
			},
			{
				text: "Which completes: 🔺🔺, 🔻🔻, 🔺🔺, ??",
				domain: "IQ",
				difficulty: 2,
				optionsJson: JSON.stringify([
					{ id: "A", text: "🔻🔻" },
					{ id: "B", text: "🔺🔺" },
					{ id: "C", text: "🔺🔻" },
					{ id: "D", text: "🔻🔺" },
				]),
				correctOption: "A",
				tagsJson: JSON.stringify(["pattern", "sequence", "shapes"]),
				explanation: "The pattern alternates between up triangles and down triangles. After 🔺🔺, next should be 🔻🔻.",
			},
		],
		});
		
		return NextResponse.json({ inserted: result.count || 20 });
	} catch (error) {
		console.error("Error seeding database:", error);
		return NextResponse.json(
			{ 
				error: error instanceof Error ? error.message : "Unknown error",
				details: error instanceof Error ? error.stack : String(error)
			}, 
			{ status: 500 }
		);
	}
}
