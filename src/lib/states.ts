export enum BaseStates {
  SUCCESS,
  ERROR,
  LOADING
}

export const PB_Codes = {
  200: "SUCCESS",
  400: "MISSING_FIELD",
  403: "UNAUTHORIZED"
} as const;

export type t_PB_Code = (typeof PB_Codes)[keyof typeof PB_Codes];
