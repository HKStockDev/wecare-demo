"use client";

import { createContext, useContext } from "react";

type AppMenuContextValue = {
  openMenu: () => void;
};

export const AppMenuContext = createContext<AppMenuContextValue | null>(null);

export function useAppMenu() {
  const ctx = useContext(AppMenuContext);
  if (!ctx) throw new Error("useAppMenu must be used within AppLayout");
  return ctx;
}
