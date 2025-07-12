"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
};

export default function ServerToaster({
  message,
  type = "info",
  duration
}: Props) {
  useEffect(() => {
    setTimeout(() => {
      toast[type](message, {
        duration
      });
    }, 50);
  }, [message, type, duration]);

  return <div className="absolute -top-20 -left-20 w-0 h-0 -z-10"></div>;
}
