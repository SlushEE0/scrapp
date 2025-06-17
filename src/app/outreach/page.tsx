import { redirect } from "next/navigation";

import { usePocketbase } from "@/lib/pbaseServer";

import type { t_pb_User, t_pb_UserData } from "@/lib/types";

import OutreachPage from "./OutreachPage";

export default async function ServerDataFetcher() {
  const [userData, user] = await usePocketbase(async (pb) => {
    let authRecord = pb.authStore.record as t_pb_User;

    let data: t_pb_UserData | undefined;
    try {
      data = await pb
        .collection("UserData")
        .getFirstListItem<t_pb_UserData>(`user="wo294dln2thb20j"`, {
          expand: "user"
        });
    } catch (e) {
      console.warn(`[OutreachPage: "${authRecord?.id}"]`, e);
    }

    return [data, authRecord];
  });

  console.log("user", user);
  if (!user.id) {
    redirect("/auth/login");
  }

  const isAdmin = user.role === "admin";

  console.log("userData", userData);

  return <OutreachPage {...{ isAdmin, userData }} />;
}
