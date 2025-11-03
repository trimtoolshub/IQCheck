import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature");
	if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

	const body = await req.text();

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET ?? ""
		);
	} catch (err: any) {
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as any;
		const testSessionId = session.metadata?.testSessionId as string | undefined;
		if (testSessionId) {
			await prisma.payment.upsert({
				where: { testSessionId },
				create: {
					testSessionId,
					provider: "STRIPE",
					status: "SUCCEEDED",
					amountCents: (session.amount_total as number) ?? 0,
					currency: session.currency ?? "usd",
					externalId: session.payment_intent as string,
					receiptUrl: session.url as string,
				},
				update: {
					status: "SUCCEEDED",
					externalId: session.payment_intent as string,
					receiptUrl: session.url as string,
				},
			});
			await prisma.testSession.update({
				where: { id: testSessionId },
				data: { paid: true },
			});
		}
	}

	return NextResponse.json({ received: true });
}

export const config = {
	api: {
		bodyParser: false,
	},
};


