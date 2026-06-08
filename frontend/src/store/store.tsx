import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type {
  Saying, ImageItem, Focus, Mindset, PersonalStore,
  TopView, CollectionSubview, EditorTab,
} from '../types'
import sayingsData from '../data/sayings.json'
import imagesData from '../data/images.json'
import { createFactoryFoci } from '../data/factoryFoci'

export const factorySayings = sayingsData as Saying[]
export const factoryImages = imagesData as ImageItem[]
export const factoryFoci = createFactoryFoci(factorySayings, factoryImages)

interface AppState {
  store: PersonalStore
  topView: TopView
  collectionSubview: CollectionSubview
  editorTab: EditorTab
  selectedSayingId: number | null
  selectedImageId: number | null
  selectedFocusId: string | null
  editorSayingId: number | null
  editorImageId: number | null
  editorFocusIds: string[]
  mindsetFocusIndex: number
  fullscreen: boolean
}

type AppAction =
  | { type: 'SET_TOP_VIEW'; view: TopView }
  | { type: 'SET_COLLECTION_SUBVIEW'; subview: CollectionSubview }
  | { type: 'SET_EDITOR_TAB'; tab: EditorTab }
  | { type: 'SELECT_SAYING'; id: number }
  | { type: 'SELECT_IMAGE'; id: number }
  | { type: 'SELECT_FOCUS'; id: string }
  | { type: 'TOGGLE_STORE_SAYING'; saying: Saying }
  | { type: 'TOGGLE_STORE_IMAGE'; image: ImageItem }
  | { type: 'TOGGLE_STORE_FOCUS'; focus: Focus }
  | { type: 'RATE_SAYING'; id: number; rating: number }
  | { type: 'RATE_IMAGE'; id: number; rating: number }
  | { type: 'RATE_FOCUS'; id: string; rating: number }
  | { type: 'RATE_MINDSET'; id: string; rating: number }
  | { type: 'SET_EDITOR_SAYING'; id: number | null }
  | { type: 'SET_EDITOR_IMAGE'; id: number | null }
  | { type: 'TOGGLE_EDITOR_FOCUS'; id: string }
  | { type: 'CREATE_FOCUS' }
  | { type: 'CREATE_MINDSET' }
  | { type: 'SET_ACTIVE_MINDSET'; id: string }
  | { type: 'SET_MINDSET_FOCUS_INDEX'; index: number }
  | { type: 'SET_FULLSCREEN'; value: boolean }

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
  topView: 'mindset',
  collectionSubview: 'images',
  editorTab: 'foci',
  selectedSayingId: factorySayings[0]?.id ?? null,
  selectedImageId: factoryImages[0]?.id ?? null,
  selectedFocusId: factoryFoci[0]?.id ?? null,
  editorSayingId: null,
  editorImageId: null,
  editorFocusIds: [],
  mindsetFocusIndex: 0,
  fullscreen: false,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TOP_VIEW':
      return { ...state, topView: action.view }
    case 'SET_COLLECTION_SUBVIEW':
      return { ...state, collectionSubview: action.subview }
    case 'SET_EDITOR_TAB':
      return { ...state, editorTab: action.tab }
    case 'SELECT_SAYING':
      return { ...state, selectedSayingId: action.id }
    case 'SELECT_IMAGE':
      return { ...state, selectedImageId: action.id }
    case 'SELECT_FOCUS':
      return { ...state, selectedFocusId: action.id }
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
    case 'SET_EDITOR_SAYING':
      return { ...state, editorSayingId: action.id }
    case 'SET_EDITOR_IMAGE':
      return { ...state, editorImageId: action.id }
    case 'TOGGLE_EDITOR_FOCUS': {
      const has = state.editorFocusIds.includes(action.id)
      const editorFocusIds = has
        ? state.editorFocusIds.filter(id => id !== action.id)
        : state.editorFocusIds.length < 5
          ? [...state.editorFocusIds, action.id]
          : state.editorFocusIds
      return { ...state, editorFocusIds }
    }
    case 'CREATE_FOCUS': {
      const saying = state.store.sayings.find(s => s.id === state.editorSayingId)
      const image = state.store.images.find(i => i.id === state.editorImageId)
      if (!saying || !image) return state
      const newFocus: Focus = {
        id: `user-${Date.now()}`,
        saying,
        imageUrl: image.url,
        imageColor: image.color,
        imageCategory: image.category,
        rating: 0.5,
        origin: 'user',
      }
      return {
        ...state,
        store: { ...state.store, foci: [...state.store.foci, newFocus] },
        editorSayingId: null,
        editorImageId: null,
      }
    }
    case 'CREATE_MINDSET': {
      if (state.editorFocusIds.length === 0) return state
      const foci = state.editorFocusIds
        .map(id => state.store.foci.find(f => f.id === id))
        .filter((f): f is Focus => f !== undefined)
      const newMindset: Mindset = {
        id: `mindset-${Date.now()}`,
        foci,
        rating: 0.5,
      }
      return {
        ...state,
        store: {
          ...state.store,
          mindsets: [...state.store.mindsets, newMindset],
          activeMindsetId: newMindset.id,
        },
        editorFocusIds: [],
      }
    }
    case 'SET_ACTIVE_MINDSET':
      return {
        ...state,
        store: { ...state.store, activeMindsetId: action.id },
        mindsetFocusIndex: 0,
      }
    case 'SET_MINDSET_FOCUS_INDEX':
      return { ...state, mindsetFocusIndex: action.index }
    case 'SET_FULLSCREEN':
      return { ...state, fullscreen: action.value }
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

  useEffect(() => {
    saveStore(state.store)
  }, [state.store])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
