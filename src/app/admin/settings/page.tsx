"use client";
import { useEffect, useState } from "react";

type Setting = { id: string; key: string; value: string };

const DEFAULT_KEYS = [
	"NEXTAUTH_URL",
	"GOOGLE_CLIENT_ID",
	"GOOGLE_CLIENT_SECRET",
	"FACEBOOK_CLIENT_ID",
	"FACEBOOK_CLIENT_SECRET",
	"STRIPE_SECRET_KEY",
	"STRIPE_WEBHOOK_SECRET",
	"JAZZCASH_MERCHANT_ID",
	"EASYPAISA_CREDENTIALS",
	"PAKPAY_API_KEY",
];

export default function SettingsPage() {
	const [settings, setSettings] = useState<Setting[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const r = await fetch("/api/settings");
			if (r.ok) {
				const list: Setting[] = await r.json();
				const map = new Map(list.map(s => [s.key, s] as const));
				const merged: Setting[] = DEFAULT_KEYS.map(k => map.get(k) ?? ({ id: "", key: k, value: "" } as any));
				setSettings(merged);
			}
			setLoading(false);
		})();
	}, []);

	async function save() {
		await fetch("/api/settings", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ entries: settings.map(({ key, value }) => ({ key, value })) }),
		});
		alert("Saved");
	}

	if (loading) return null;

	return (
		<div className="p-6 space-y-4 max-w-2xl">
			<h1 className="text-2xl font-semibold">Settings</h1>
			<div className="space-y-3">
				{settings.map((s, i) => (
					<div key={s.key} className="space-y-1">
						<label className="text-sm text-gray-600">{s.key}</label>
						<input
							className="w-full border rounded px-3 py-2"
							type="text"
							value={s.value ?? ""}
							onChange={e => {
								const next = [...settings];
								next[i] = { ...s, value: e.target.value };
								setSettings(next);
							}}
						/>
					</div>
				))}
			</div>
			<button className="rounded-md bg-black text-white px-4 py-2" onClick={save}>
				Save Settings
			</button>
		</div>
	);
}





