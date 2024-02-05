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
      case BackdropType.NAV:
        return {
          ...state,
          navBackdrop: !state.navBackdrop,
          // Set the other backdrops to false
        };
      // Add more cases for other backdrops as needed
      default:
        return state;
    }
  };

  const [backdropState, dispatch] = useReducer(backdropReducer, initialState);

  const toggleBackdrop: ToggleBackdrop = (backdropType: BackdropType) => {
    dispatch({ type: backdropType });
  };

  return {
    backdropState,
    toggleBackdrop,
  };
}
