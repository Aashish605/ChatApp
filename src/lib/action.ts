"use server";

import Cookies from "js-cookie";

export async function handleLogin(
    userId: string,
    accessToken: string,
    refreshToken: string,
) {
    const cookieStore = await Cookies();
    cookieStore.set("userId", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
    });
    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
    });
}

export async function resetAuthCookies() {
    const cookieStore = await Cookies();
    cookieStore.remove("userId");
    cookieStore.remove("accessToken");
    cookieStore.remove("refreshToken");
}

export async function getUseId() {
    const cookieStore = await Cookies();
    const userId = cookieStore.get("userId")?.value;
    return userId ? userId : null;
}


