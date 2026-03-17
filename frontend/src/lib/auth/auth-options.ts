import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
                    const response = await axios.post(`${baseUrl}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password
                    });

                    const data = response.data;

                    if (data && data.access_token) {
                        // Return user object with token and other info
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: `${data.user.firstName} ${data.user.lastName}`,
                            role: data.user.role,
                            accessToken: data.access_token,
                            dashboard: data.dashboard
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.accessToken = (user as any).accessToken;
                token.dashboard = (user as any).dashboard;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session as any).user.id = token.sub; // Ensure ID is present
                (session as any).user.role = token.role;
                (session as any).user.accessToken = token.accessToken;
                (session as any).dashboard = token.dashboard;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
