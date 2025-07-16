import clientPromise from "@/libs/mongoConnect";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { dbConnect } from "./dbConnect";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise) as Adapter,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(credentials.email)) {
                    throw new Error("Invalid email format");
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error("Invalid email or password");
                }

                const passwordOk = await bcrypt.compare(credentials.password, user.password);
                if (!passwordOk) {
                    throw new Error("Invalid email or password");
                }

                // Trả về user info cho JWT
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.avatar = user.avatar;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "user";
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
        updateAge: 60 * 60,
    },
};
