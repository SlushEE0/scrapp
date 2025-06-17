"use client";

import { Button } from "@/components/ui/button";
import {
  populateFakeUsers,
  populateFakeOutreachSessions
} from "@/lib/tests/faker";

export default function ({}) {
  const yay = async function () {
    await populateFakeUsers(15);
    populateFakeOutreachSessions(15);
  };

  return <Button onClick={yay}>ALSfkjlashdf</Button>;
}
