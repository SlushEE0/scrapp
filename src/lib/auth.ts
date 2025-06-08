import { Dispatch, SetStateAction } from "react";

import { pb } from "./pocketbase";
import { PBUser_t } from "./types";

export async function loginEmailPass(email: string, password: string) {
  try {
    pb.collection("users").authWithPassword(email, password);
  } catch (error) {
    console.log("Login failed:", error);
  }
}

export async function loginOAuth_Google() {
  const authData = await pb
    .collection("users")
    .authWithOAuth2({ provider: "google" });
}

export async function loginOAuth_Discord() {
  const authData = await pb
    .collection("users")
    .authWithOAuth2({ provider: "discord" });
}

export function registerAuthCallback(
  setUser: Dispatch<SetStateAction<PBUser_t | null>>
) {
  return pb.authStore.onChange(() => {
    const user = pb.authStore.record;
    setUser(user as any);
  }, true);
}

export function logout() {
  pb.authStore.clear();
}
