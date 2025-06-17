import { pb } from "./pbaseClient";
import { BaseStates } from "./states";
import { setPocketbaseCookie } from "./pbaseServer";

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

async function storeServerCookie() {
  setPocketbaseCookie(
    pb.authStore.exportToCookie({
      secure: false,
      httpOnly: false,
      sameSite: "lax"
    })
  );
}

export function logout() {
  pb.authStore.clear();
  setPocketbaseCookie("");
  window.location.assign("/auth/login");
}
