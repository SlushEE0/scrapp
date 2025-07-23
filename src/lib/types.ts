import { type RecordModel } from "pocketbase";

export interface t_pb_User extends RecordModel {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  verified: boolean;
  usesOAuth: boolean;
}

export type OAuthProvider = "google" | "discord";
