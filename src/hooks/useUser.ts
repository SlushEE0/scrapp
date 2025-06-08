import { useState } from "react";

import type { User_t } from "@/lib/types";

export function useUser() {
  const [user, setUser] = useState<User_t>({
    username: "John Doe",
    email: "john@example.com",
    avatarUrl: ""
  });

  return [user, setUser] as const;
}
