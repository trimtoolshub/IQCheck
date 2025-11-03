import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { providers, getProvider } from "@/lib/payments/providers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		// Auth is optional - users can pay without signing in
		let sessionData = null;
		if (typeof auth === 'function') {
			try {
				sessionData = await auth();
			} catch (authError: any) {
				// Continue without auth - payment is allowed without sign in
				console.warn("Auth failed, continuing without session for checkout:", authError);
			}
		}

		const { testSessionId, countryCode, paymentProvider } = await req.json().catch(() => ({}));
		if (!testSessionId) {
			return NextResponse.json({ error: "Missing testSessionId" }, { status: 400 });
		}

		const testSession = await prisma.testSession.findUnique({ where: { id: testSessionId } });
		if (!testSession) {
			return NextResponse.json({ error: "Invalid testSessionId" }, { status: 404 });
		}

		const isPakistan = (countryCode ?? testSession.countryCode)?.toUpperCase() === "PK";
		const amountCents = isPakistan ? 9900 : 99; // PKR 99.00 vs USD $0.99
		const currency = isPakistan ? "pkr" : "usd";

		// For Pakistan, use local payment providers (JazzCash, EasyPaisa, PakPay)
		if (isPakistan) {
			const providerName = paymentProvider || "jazzcash"; // Default to JazzCash for Pakistan
			const provider = getProvider(providerName);
			
			if (!provider) {
				return NextResponse.json({ 
					error: `Payment provider "${providerName}" not found. Available: jazzcash, easypaisa, pakpay` 
				}, { status: 400 });
			}

			try {
				const result = await provider.createPayment({
					amountCents,
					currency,
					testSessionId,
					metadata: {
						userId: sessionData?.user?.id || null,
					},
				});

				return NextResponse.json({ 
					url: result.redirectUrl,
					provider: result.provider,
					amount: amountCents / 100,
					currency: "PKR"
				});
			} catch (error: any) {
				console.error(`Payment provider error (${providerName}):`, error);
				return NextResponse.json(
					{ error: error?.message || `Failed to create ${providerName} payment session` },
					{ status: 500 }
				);
			}
		}

		// For non-Pakistan, use Stripe
		if (!stripe) {
			return NextResponse.json({ 
				error: "Payment processing not available. Please configure Stripe API keys." 
			}, { status: 503 });
		}

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [{
				price_data: {
					currency: "usd",
					product_data: { name: "Detailed Report" },
					unit_amount: amountCents,
				},
				quantity: 1,
			}],
			success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/test/${testSessionId}/report?paid=1`,
			cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/test/${testSessionId}/report`,
			metadata: {
				userId: sessionData?.user?.id || null,
				testSessionId,
			},
		});

		return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url, provider: "STRIPE" });
	} catch (error: any) {
		console.error("Checkout session error:", error);
		return NextResponse.json(
			{ error: error?.message || "Failed to create checkout session" },
			{ status: 500 }
		);
	}
}


