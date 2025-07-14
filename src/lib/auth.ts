import { pb } from "./pbaseClient";
import { BaseStates } from "./states";
import { setPocketbaseCookie } from "./pbaseServer";

import { OAuthProvider } from "./types";

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

export async function loginOAuth(provider: OAuthProvider) {
  const authData = await pb.collection("users").authWithOAuth2({ provider });

  storeServerCookie();
  if (authData.token) return BaseStates.SUCCESS;
  else return BaseStates.ERROR;
}

async function storeServerCookie() {
  setPocketbaseCookie(pb.authStore.exportToCookie());
}

export function logout() {
  pb.authStore.clear();
  setPocketbaseCookie("");
  window.location.assign("/auth/login");
}
