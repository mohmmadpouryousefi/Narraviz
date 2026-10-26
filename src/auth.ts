import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getDummyHash, verifyPassword } from "@/lib/password";
import { signInSchema } from "@/lib/validation";

/** GitHub sign-in is only offered when its OAuth app credentials are configured. */
export const githubEnabled = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(raw) {
      const parsed = signInSchema.safeParse(raw);
      if (!parsed.success) return null;

      const user = await db.user.findUnique({ where: { email: parsed.data.email } });
      // Always run one hash so unknown emails and wrong passwords take the same time.
      const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? (await getDummyHash()));
      if (!user?.passwordHash || !valid) return null;

      return { id: user.id, name: user.name, email: user.email, image: user.image };
    },
  }),
];
if (githubEnabled) providers.unshift(GitHub);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // The adapter's types target the default @prisma/client output; ours is generated into src/generated.
  adapter: PrismaAdapter(db as unknown as Parameters<typeof PrismaAdapter>[0]),
  // Credentials sign-in only works with JWT sessions in Auth.js.
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login", error: "/auth/login" },
  providers,
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
