import { useState, useEffect } from "react";

import { registerAuthCallback } from "@/lib/db/user";
import type { t_pb_User } from "@/lib/types";

export function useUser() {
  const [user, setUser] = useState<t_pb_User | null>(null);

  useEffect(() => {
    return registerAuthCallback(setUser);
  }, []);

  return { user, setUser } as const;
}
