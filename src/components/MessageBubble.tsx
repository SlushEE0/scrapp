"use client";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  image?: string | null;
}

export function MessageBubble({
  message,
  isUser,
  timestamp,
  image
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100"
        )}>
        {image && (
          <div className="mb-2">
            <img
              src={image}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg border border-white/20"
            />
          </div>
        )}
        <p className="text-sm leading-relaxed break-words">{message}</p>
        {timestamp && (
          <p
            className={cn(
              "text-xs mt-1 opacity-70",
              isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
            )}>
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        )}
      </div>
    </div>
  );
}
