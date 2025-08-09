import { useState, useEffect } from "react";

import { registerAuthCallback } from "@/lib/db/user";
import type { pb_UsersColItem } from "@/lib/types";

export function useUser() {
  const [user, setUser] = useState<pb_UsersColItem | null>(null);

  useEffect(() => {
    return registerAuthCallback(setUser);
  }, []);

  return { user, setUser } as const;
}
