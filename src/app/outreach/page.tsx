"use client";

import { useEffect } from "react";

import { useNavbar } from "@/hooks/useNavbar";

export default function ({}) {
  const { setDefaultShown } = useNavbar();

  useEffect(() => {
    setDefaultShown(false);
  }, [setDefaultShown]);

  

  return ;
}
