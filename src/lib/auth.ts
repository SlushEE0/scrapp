import { Dispatch, SetStateAction } from "react";

import { pb } from "./pocketbase";
import { PBUser_t } from "./types";
import { BaseStates } from "./states";
import { getPocketbaseCookie, setPocketbaseCookie } from "./pbServer";

export async function loginEmailPass(
  email: string,
  password: string
): Promise<BaseStates> {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    storeServerCookie();
    if (authData.token) return BaseStates.SUCCESS;
    else return BaseStates.ERROR;
  } catch (error) {
    console.log("Login failed:", error);
    return BaseStates.ERROR;
  }
}

export async function loginOAuth_Google() {
  const authData = await pb
    .collection("users")
    .authWithOAuth2({ provider: "google" });

  storeServerCookie();
  if (authData.token) return BaseStates.SUCCESS;
  else return BaseStates.ERROR;
}

export async function loginOAuth_Discord() {
  const authData = await pb
    .collection("users")
    .authWithOAuth2({ provider: "discord" });

  storeServerCookie();
  if (authData.token) return BaseStates.SUCCESS;
  else return BaseStates.ERROR;
}

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  try {
    const authData = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name
    });

    if (authData.id) return BaseStates.SUCCESS;
    else return BaseStates.ERROR;
  } catch (error) {
    console.log("User creation failed:", error);

    return BaseStates.ERROR;
  }
}

async function storeServerCookie() {
  setPocketbaseCookie(
    pb.authStore.exportToCookie({
      secure: false,
      httpOnly: false,
      sameSite: "lax"
    })
  );
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
  setPocketbaseCookie("");
  window.location.assign("/auth/login");
}
