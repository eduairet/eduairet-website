import { useReducer } from 'react';
import {
  BackdropHook,
  BackdropState,
  BackdropType,
  ToggleBackdrop,
} from '@/models';

export default function useBackdrop(): BackdropHook {
  const initialState = new BackdropState();

  const backdropReducer = (
    state: BackdropState,
    action: { type: BackdropType }
  ) => {
    switch (action.type) {
      case BackdropType.OPEN_NAV_MAIN:
        return {
          navMainBackdrop: true,
          navLangBackdrop: false,
        };
      case BackdropType.OPEN_NAV_LANG:
        return {
          navMainBackdrop: false,
          navLangBackdrop: true,
        };
      case BackdropType.CLOSE_NAV:
        return {
          navMainBackdrop: false,
          navLangBackdrop: false,
        };
      default:
        return state;
    }
  };

  const [backdropState, dispatch] = useReducer(backdropReducer, initialState);

  const setBackdrop: ToggleBackdrop = (backdropType: BackdropType) => {
    dispatch({ type: backdropType });
  };

  return {
    backdropState,
    setBackdrop,
  };
}
