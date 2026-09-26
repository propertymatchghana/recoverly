import type { AppSettings, AppState } from '@/types';
import { defaultSettings } from './format';

const STORAGE_KEY = 'recoverly_state_v1';

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState(state: Partial<AppState>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function defaultState(): AppState {
  return {
    isAuth: false,
    user: null,
    parsedFile: null,
    columnMapping: null,
    records: [],
    analysis: [],
    isDemoData: false,
    settings: defaultSettings(),
    handledActions: [],
    dismissedActions: [],
  };
}

export function loadSettings(): AppSettings {
  const state = loadState();
  if (state?.settings) return { ...defaultSettings(), ...state.settings };
  return defaultSettings();
}

export function saveSettings(settings: AppSettings): void {
  const state = loadState() || {};
  saveState({ ...state, settings });
}
