/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */

import { BackdropState, BackdropType } from '..';

export type ToggleBackdrop = (_backdropType: BackdropType) => void;

export type BackdropHook = {
  backdropState: BackdropState;
  setBackdrop: ToggleBackdrop;
};
