import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const providers: any[] = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }));
}
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.push(Facebook({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }));
}

export const authConfig: any = {
    adapter: PrismaAdapter(prisma),
    providers,
	callbacks: {
		async session({ session, user }: any) {
			if (session.user) {
				(session.user as any).id = user.id;
				(session.user as any).role = (user as any).role ?? "USER";
			}
			return session;
		},
	},
    secret: process.env.NEXTAUTH_SECRET || "dev-secret",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);


