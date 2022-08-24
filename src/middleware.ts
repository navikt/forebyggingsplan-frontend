import { NextRequest, NextResponse } from "next/server";
import { verifiserToken } from "./auth/idporten";

const bypassEndepunkter = ["/api/isAlive", "/api/isReady"];

export async function middleware(request: NextRequest) {
    if (
        bypassEndepunkter.some((endepunkt) => {
            return request.nextUrl.pathname.startsWith(endepunkt);
        })
    ) {
        return NextResponse.next();
    }
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.redirect(new URL("/oauth2/login", request.url));
    }
    return verifiserToken(token)
        .then(() => NextResponse.next())
        .catch((reason) => {
            console.log(reason);
            return NextResponse.redirect(new URL("/oauth2/login", request.url));
        });
}
