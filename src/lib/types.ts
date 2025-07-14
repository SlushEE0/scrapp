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
  role: "member" | "admin" | "guest";
}

export interface t_pb_UserData extends RecordModel {
  created: string;
  updated: string;
  user: string;
  outreachMinutes: number;
  buildMinutes: number;
  lastOutreachEvent: string;
  lastBuildEvent: string;
  expand?: {
    user: t_pb_User;
  };
}

export interface t_pb_OutreachEvent extends RecordModel {
  id: string;
  name: string;
  created: string;
  updated: string;
  date: string;
}

export interface t_pb_OutreachSession extends RecordModel {
  id: string;
  user: string;
  minutes: number;
  created: string;
  expand?: {
    user: t_pb_User;
    event: t_pb_OutreachEvent;
  };
}

export type OAuthProvider = "google" | "discord";
