"use client";

import { Button } from "@/components/ui/button";
import {
  populateFakeUsers,
  populateFakeOutreachSessions
} from "@/lib/tests/faker";

export default function ({}) {
  const yay = async function () {
    // await populateFakeUsers(15);
    populateFakeOutreachSessions(28);
  };

  return <Button onClick={yay}>ALSfkjlashdf</Button>;

  // return <Chip color="warning" variant="flat">{"nignigngin"}</Chip>;
}
