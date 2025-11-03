"use client";
import { useEffect, useRef } from "react";

export default function AdDisplay({ onAdComplete }: { onAdComplete: () => void }) {
	const adContainerRef = useRef<HTMLDivElement>(null);
	const adDisplayedRef = useRef(false);

	useEffect(() => {
		// Load Google AdSense script if not already loaded
		if (typeof window !== 'undefined' && !(window as any).adsbygoogle && !adDisplayedRef.current) {
			const script = document.createElement('script');
			script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
			script.async = true;
			script.crossOrigin = "anonymous";
			script.onload = () => {
				// Trigger ad display after script loads
				if (adContainerRef.current) {
					try {
						((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
					} catch (e) {
						console.log("AdSense error:", e);
					}
				}
			};
			document.head.appendChild(script);
			adDisplayedRef.current = true;
		}

		// Simulate ad completion after 10 seconds (in production, use actual ad events)
		const timer = setTimeout(() => {
			onAdComplete();
		}, 10000);

		return () => clearTimeout(timer);
	}, [onAdComplete]);

	return (
		<div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
			<div ref={adContainerRef} className="w-full">
				{/* Google AdSense Ad Unit */}
				<ins
					className="adsbygoogle"
					style={{ display: 'block' }}
					data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
					data-ad-slot="YOUR_AD_SLOT_ID"
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
				
				{/* Fallback message if AdSense not configured */}
				<div className="text-gray-500 text-sm mt-4">
					<p>Ad will appear here</p>
					<p className="text-xs mt-2">(Configure Google AdSense in admin panel)</p>
				</div>
			</div>
		</div>
	);
}

