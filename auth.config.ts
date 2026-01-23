import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isLoginPage = nextUrl.pathname.startsWith("/login");
            const isAdminPage = nextUrl.pathname.startsWith("/admin");

            if (isAdminPage && !isLoggedIn) {
                return NextResponse.redirect(new URL("/login", nextUrl));
            }

            if (isLoginPage && isLoggedIn) {
                return NextResponse.redirect(new URL("/admin", nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
