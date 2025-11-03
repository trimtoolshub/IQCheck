import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
	const session = await auth();
	if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const list = await prisma.setting.findMany({ orderBy: { key: "asc" } });
	return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
	const session = await auth();
	if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	const body = await req.json();
	const entries = Array.isArray(body) ? body : body?.entries;
	if (!Array.isArray(entries)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	for (const e of entries) {
		if (!e.key) continue;
		await prisma.setting.upsert({
			where: { key: e.key },
			create: { key: e.key, value: e.value ?? "" },
			update: { value: e.value ?? "" },
		});
	}
	return NextResponse.json({ ok: true });
}





