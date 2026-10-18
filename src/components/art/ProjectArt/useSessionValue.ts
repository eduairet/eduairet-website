import { useSyncExternalStore } from 'react';

// Memory first, so typing still works where sessionStorage is blocked.
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const read = (key: string) => {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export function useSessionValue<T>(key: string, initial: T) {
  // The server snapshot is null, so hydration starts from `initial`.
  const saved = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );
  const value: T = saved === null ? initial : JSON.parse(saved);

  const save = (next: T) => {
    const raw = JSON.stringify(next);
    memory.set(key, raw);
    try {
      sessionStorage.setItem(key, raw);
    } catch {
      // The value is already in memory. A blocked store must not throw.
    }
    listeners.forEach((listener) => listener());
  };

  return [value, save] as const;
}
