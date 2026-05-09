import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from 'react';
import { createInitialStoreState } from '../domain/seed';
import type { CompassStoreState, ViewName } from '../domain/types';

type CompassAction =
  | { type: 'set-active-view'; view: ViewName }
  | { type: 'select-mindset'; index: number }
  | { type: 'select-focus'; index: number }
  | { type: 'update-mindset-notes'; notes: string };

interface CompassStoreValue {
  state: CompassStoreState;
  dispatch: Dispatch<CompassAction>;
}

const STORAGE_KEY = 'digicompass-store';

const clampIndex = (value: number, size: number) => {
  if (size <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), size - 1);
};

const loadPersistedState = (): CompassStoreState => {
  if (typeof window === 'undefined') {
    return createInitialStoreState();
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return createInitialStoreState();
  }

  try {
    return JSON.parse(rawState) as CompassStoreState;
  } catch {
    return createInitialStoreState();
  }
};

const CompassStoreContext = createContext<CompassStoreValue | null>(null);

const reducer = (state: CompassStoreState, action: CompassAction): CompassStoreState => {
  switch (action.type) {
    case 'set-active-view':
      return { ...state, activeView: action.view };
    case 'select-mindset': {
      const nextMindsetIndex = clampIndex(action.index, state.data.mindsets.length);
      const nextFocusCount = state.data.mindsets[nextMindsetIndex]?.foci.length ?? 0;

      return {
        ...state,
        selectedMindsetIndex: nextMindsetIndex,
        selectedFocusIndex: clampIndex(0, nextFocusCount),
      };
    }
    case 'select-focus': {
      const focusCount =
        state.data.mindsets[state.selectedMindsetIndex]?.foci.length ?? 0;

      return {
        ...state,
        selectedFocusIndex: clampIndex(action.index, focusCount),
      };
    }
    case 'update-mindset-notes': {
      const nextMindsets = state.data.mindsets.map((mindset, index) =>
        index === state.selectedMindsetIndex ? { ...mindset, notes: action.notes } : mindset,
      );

      return {
        ...state,
        data: {
          ...state.data,
          mindsets: nextMindsets,
          collection: {
            ...state.data.collection,
            mindsets: nextMindsets,
          },
        },
      };
    }
    default:
      return state;
  }
};

export const CompassStoreProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadPersistedState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <CompassStoreContext.Provider value={value}>
      {children}
    </CompassStoreContext.Provider>
  );
};

export const useCompassStore = () => {
  const context = useContext(CompassStoreContext);

  if (!context) {
    throw new Error('useCompassStore must be used within CompassStoreProvider');
  }

  return context;
};
