import { useState, useEffect } from "react";

import { registerAuthCallback } from "@/lib/auth"; // adjust path to your PocketBase instance
import type { t_pb_User } from "@/lib/types";

import { pb } from "@/lib/pbaseClient";

export function useUser() {
  const [user, setUser] = useState<t_pb_User | null>(null);

  useEffect(() => {
    return registerAuthCallback(setUser);
  }, []);

  return { user, setUser } as const;
}
