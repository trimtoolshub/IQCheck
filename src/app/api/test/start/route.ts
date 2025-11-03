import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const { domain = "IQ", countryCode } = await req.json().catch(() => ({}));
		const test = await prisma.testSession.create({
			data: {
				status: "IN_PROGRESS",
				countryCode: countryCode ?? undefined,
			},
		});
		return NextResponse.json({ id: test.id, domain });
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
	}
}


