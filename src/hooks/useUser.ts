import { useState, useEffect } from "react";

import { registerAuthCallback } from "@/lib/auth"; // adjust path to your PocketBase instance
import type { PBUser_t } from "@/lib/types";

export function useUser() {
  const [user, setUser] = useState<PBUser_t | null>(null);

  useEffect(() => {
    return registerAuthCallback(setUser);
  }, []);

  return { user, setUser } as const;
}
