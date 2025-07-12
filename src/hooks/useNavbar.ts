"use client";

import { useSyncExternalStore } from "react";

// Global state store
let navbarState = {
  forcedDisable: false,
  renderOnlyHome: false,
  defaultToShown: true
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return navbarState;
}

const setForcedDisable = (value: boolean) => {
  navbarState = { ...navbarState, forcedDisable: value };
  emitChange();
};

const setRenderOnlyHome = (value: boolean) => {
  navbarState = { ...navbarState, renderOnlyHome: value };
  emitChange();
};

const setDefaultShown = (value: boolean) => {
  navbarState = { ...navbarState, defaultToShown: value };
  emitChange();
};

export function useNavbar() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...state,
    setForcedDisable,
    setRenderOnlyHome,
    setDefaultShown
  } as const;
}
