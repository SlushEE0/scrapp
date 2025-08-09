import PocketBase from "pocketbase";
import { type pb_UsersColItem } from "./types";

const POCKETBASE_URL = process.env.NEXT_PUBLIC_PB_URL || "";

if (!POCKETBASE_URL) {
  throw new Error(
    "POCKETBASE_URL is not defined. Please set the NEXT_PUBLIC_PB_URL environment variable."
  );
}

export const pb = new PocketBase(POCKETBASE_URL);

export function recordToImageUrl(record?: pb_UsersColItem) {
  if (!record || !record.id) return null;

  const fileUrl = new URL(
    `${POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${record.avatar}`
  );

  return fileUrl;
}
