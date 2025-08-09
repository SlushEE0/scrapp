"use client";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message?: string;
  image?: string | null;
  isUser: boolean;
  timestamp?: Date;
  onImageClick?: (src: string) => void;
}

export function MessageBubble({
  message,
  image,
  isUser,
  timestamp,
  onImageClick
}: MessageBubbleProps) {
  const hasText = !!(message && message.length > 0)
  const hasImage = !!image

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
        {hasImage && (
          <img
            src={image as string}
            alt="attachment"
            onClick={() => image && onImageClick?.(image)}
            className={cn(
              "mb-2 max-h-64 w-auto rounded-lg border border-white/20",
              onImageClick ? "cursor-pointer" : ""
            )}
          />
        )}
        {hasText && (
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        )}
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
