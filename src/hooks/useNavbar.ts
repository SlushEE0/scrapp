"use client";

import { useSyncExternalStore } from "react";

// Global state store
let navbarState = {
  forcedDisable: true,
  renderOnlyHome: false
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

export function useNavbar() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setForcedDisable = (value: boolean) => {
    navbarState = { ...navbarState, forcedDisable: value };
    emitChange();
  };

  const setRenderOnlyHome = (value: boolean) => {
    navbarState = { ...navbarState, renderOnlyHome: value };
    emitChange();
  };

  return {
    forcedDisable: state.forcedDisable,
    setForcedDisable,
    renderOnlyHome: state.renderOnlyHome,
    setRenderOnlyHome
  } as const;
}
