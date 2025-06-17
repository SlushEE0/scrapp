import PocketBase from "pocketbase";
import { type t_pb_User } from "./types";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "";
export const pb = new PocketBase(PB_URL);

export function recordToImageUrl(record?: t_pb_User) {
  if (!record || !record.id) return null;

  const fileUrl = new URL(
    `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.avatar}`
  );

  return fileUrl;
}
