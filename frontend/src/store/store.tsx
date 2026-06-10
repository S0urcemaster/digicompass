import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { Saying, ImageItem, Focus, Mindset, PersonalStore, TopView, CollectionTab } from '../types'
import sayingsData from '../data/sayings.json'
import imagesData from '../data/images.json'
import { createFactoryFoci } from '../data/factoryFoci'

export const factorySayings = sayingsData as Saying[]
export const factoryImages = imagesData as ImageItem[]
export const factoryFoci = createFactoryFoci(factorySayings, factoryImages)

interface AppState {
  store: PersonalStore
  topView: TopView
  collectionTab: CollectionTab
}

type AppAction =
  | { type: 'SET_TOP_VIEW'; view: TopView }
  | { type: 'SET_COLLECTION_TAB'; tab: CollectionTab }
  | { type: 'TOGGLE_STORE_SAYING'; saying: Saying }
  | { type: 'TOGGLE_STORE_IMAGE'; image: ImageItem }
  | { type: 'TOGGLE_STORE_FOCUS'; focus: Focus }
  | { type: 'RATE_SAYING'; id: number; rating: number }
  | { type: 'RATE_IMAGE'; id: number; rating: number }
  | { type: 'RATE_FOCUS'; id: string; rating: number }
  | { type: 'RATE_MINDSET'; id: string; rating: number }
  | { type: 'CREATE_FOCUS'; focus: Focus }
  | { type: 'ADD_MINDSET'; mindset: Mindset }
  | { type: 'UPDATE_MINDSET'; id: string; updates: Partial<Mindset> }
  | { type: 'REMOVE_MINDSET'; id: string }
  | { type: 'SET_ACTIVE_MINDSET'; id: string | null }
  | { type: 'RESET' }

const STORAGE_KEY = 'digicompass-store'

function loadStore(): PersonalStore {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as PersonalStore
  } catch { /* ignore */ }
  return { sayings: [], images: [], foci: [], mindsets: [], activeMindsetId: null }
}

function saveStore(store: PersonalStore) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch { /* ignore */ }
}

const initialState: AppState = {
  store: loadStore(),
  topView: 'primary',
  collectionTab: 'images',
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TOP_VIEW':
      return { ...state, topView: action.view }
    case 'SET_COLLECTION_TAB':
      return { ...state, collectionTab: action.tab }

    case 'TOGGLE_STORE_SAYING': {
      const inStore = state.store.sayings.some(s => s.id === action.saying.id)
      const sayings = inStore
        ? state.store.sayings.filter(s => s.id !== action.saying.id)
        : [...state.store.sayings, action.saying]
      return { ...state, store: { ...state.store, sayings } }
    }
    case 'TOGGLE_STORE_IMAGE': {
      const inStore = state.store.images.some(i => i.id === action.image.id)
      const images = inStore
        ? state.store.images.filter(i => i.id !== action.image.id)
        : [...state.store.images, action.image]
      return { ...state, store: { ...state.store, images } }
    }
    case 'TOGGLE_STORE_FOCUS': {
      const inStore = state.store.foci.some(f => f.id === action.focus.id)
      const foci = inStore
        ? state.store.foci.filter(f => f.id !== action.focus.id)
        : [...state.store.foci, action.focus]
      return { ...state, store: { ...state.store, foci } }
    }

    case 'RATE_SAYING': {
      const sayings = state.store.sayings.map(s =>
        s.id === action.id ? { ...s, rating: action.rating } : s)
      return { ...state, store: { ...state.store, sayings } }
    }
    case 'RATE_IMAGE': {
      const images = state.store.images.map(i =>
        i.id === action.id ? { ...i, rating: action.rating } : i)
      return { ...state, store: { ...state.store, images } }
    }
    case 'RATE_FOCUS': {
      const foci = state.store.foci.map(f =>
        f.id === action.id ? { ...f, rating: action.rating } : f)
      return { ...state, store: { ...state.store, foci } }
    }
    case 'RATE_MINDSET': {
      const mindsets = state.store.mindsets.map(m =>
        m.id === action.id ? { ...m, rating: action.rating } : m)
      return { ...state, store: { ...state.store, mindsets } }
    }

    case 'CREATE_FOCUS':
      return {
        ...state,
        store: { ...state.store, foci: [...state.store.foci, action.focus] },
      }
    case 'ADD_MINDSET': {
      const mindsets = [...state.store.mindsets, action.mindset]
      return {
        ...state,
        store: { ...state.store, mindsets, activeMindsetId: action.mindset.id },
      }
    }
    case 'UPDATE_MINDSET': {
      const mindsets = state.store.mindsets.map(m =>
        m.id === action.id ? { ...m, ...action.updates } : m)
      return { ...state, store: { ...state.store, mindsets } }
    }
    case 'REMOVE_MINDSET': {
      const mindsets = state.store.mindsets.filter(m => m.id !== action.id)
      const activeMindsetId = state.store.activeMindsetId === action.id
        ? (mindsets[0]?.id ?? null)
        : state.store.activeMindsetId
      return { ...state, store: { ...state.store, mindsets, activeMindsetId } }
    }
    case 'SET_ACTIVE_MINDSET':
      return { ...state, store: { ...state.store, activeMindsetId: action.id } }

    case 'RESET':
      return { ...initialState, store: { sayings: [], images: [], foci: [], mindsets: [], activeMindsetId: null } }

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => { saveStore(state.store) }, [state.store])
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
