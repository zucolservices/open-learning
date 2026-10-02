/** Everything a learner can change in this module, saved for resume. */
export interface CryptoState {
  [key: string]: unknown;
  frame: number;
  message: string;
  rotations: number;
  key: "enabled" | "disabled" | "pending" | "destroyed";
  restarted: boolean;
  owner: "provider" | "customer" | "external";
}

export const initialState: CryptoState = {
  frame: 0,
  message: "Customer KYC record #4471",
  rotations: 0,
  key: "enabled",
  restarted: false,
  owner: "provider",
};
