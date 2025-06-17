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
