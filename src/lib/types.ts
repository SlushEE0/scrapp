import { type RecordModel } from "pocketbase";

export interface pb_UsersColItem extends RecordModel {
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

export type PredictionObjects =
  | "bottle"
  | "wine glass"
  | "cup"
  | "bowl"
  | "fork"
  | "knife"
  | "spoon"
  | "vase"
  | "chair"
  | "bench"
  | "laptop"
  | "mouse"
  | "keyboard"
  | "cell phone"
  | "banana"
  | "apple"
  | "orange"
  | "broccoli"
  | "carrot"
  | "pizza"
  | "donut"
  | "cake"
  | "sandwich"
  | "hot dog"
  | "handbag"
  | "backpack"
  | "umbrella";

export type PredictionRoutes =
  | "Recycle"
  | "Compost"
  | "Store Drop-off"
  | "Landfill / Donate / Check rules";

export type Detection = {
  bbox: [number, number, number, number];
  class_name: PredictionObjects;
  confidence: number;
  route: PredictionRoutes;
};

export type PredictionResult = {
  objects: PredictionObjects[];
  bin_totals: Record<string, number>;
  detections: Detection[];
};

export type OAuthProvider = "google" | "discord";
