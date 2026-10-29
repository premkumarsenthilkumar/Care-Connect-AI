import type { AppState } from '../types';
import { createInitialState, STORAGE_KEY } from '../data/seed';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    // Basic shape validation
    if (!parsed.profile || !Array.isArray(parsed.appointments) || !Array.isArray(parsed.conversations)) {
      return createInitialState();
    }
    return {
      ...createInitialState(),
      ...parsed,
      settings: { ...createInitialState().settings, ...parsed.settings },
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist state', e);
  }
}

export function clearState(): AppState {
  const fresh = createInitialState();
  saveState(fresh);
  return fresh;
}
