"use client";

export default function SignInPage() {
	const handleSignIn = (provider: string) => {
		window.location.href = `/api/auth/signin/${provider}?callbackUrl=/`;
	};

	return (
		<div className="min-h-dvh flex items-center justify-center p-6">
			<div className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Sign in</h1>
				<button
					className="w-full rounded-md bg-black text-white py-2"
					onClick={() => handleSignIn("google")}
				>
					Continue with Google
				</button>
				<button
					className="w-full rounded-md border py-2"
					onClick={() => handleSignIn("facebook")}
				>
					Continue with Facebook
				</button>
			</div>
		</div>
	);
}





