/** Everything a learner can change in this module, saved for resume. */
export interface SnapState {
  [key: string]: unknown;
  menu: string;
  copyAbout: boolean;
  edited: boolean;
}

export const initialState: SnapState = { menu: "<h1>Menu</h1>\n", copyAbout: false, edited: false };
