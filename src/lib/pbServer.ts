"use server";

import { cookies } from "next/headers";

import PocketBase from "pocketbase";

const pbServer = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || "");

export async function setPocketbaseCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set("pb_auth", value);

  console.log("Pocketbase cookie set:", value);
}

export async function getPocketbaseCookie() {
  const cookieStore = await cookies();
  const authData = cookieStore.get("pb_auth")?.value || "";

  pbServer.authStore.loadFromCookie(authData);
  if (!authData) return null;

  await pbServer.collection("users").authRefresh();
  return pbServer.authStore;
}
