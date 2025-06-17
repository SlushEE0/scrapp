"use client";

import { useEffect } from "react";

import { pb } from "@/lib/pbaseClient";
import { t_pb_UserData } from "@/lib/types";

export default function ({}) {
  const s = async function () {
    let userData: t_pb_UserData | undefined;
    try {
      userData = await pb
        .collection("UserData")
        .getFirstListItem<t_pb_UserData>(`user="wo294dln2thb20j"`);
    } catch (e) {
      console.log("e");
      console.warn("Failed to fetch user data:", e);
    }

    console.log("userData", userData || "undefined");
  };

  useEffect(() => {
    s();
  }, []);

  return <h1>Hello</h1>;
}
