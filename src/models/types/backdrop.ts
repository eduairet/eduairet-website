import { BackdropState, BackdropType } from '..';

export type ToggleBackdrop = (_backdropType: BackdropType) => void;

export type BackdropHook = {
  backdropState: BackdropState;
  toggleBackdrop: ToggleBackdrop;
};
