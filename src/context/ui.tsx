"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type UIContextType = {
  isOffcanvasOpen: boolean;
  openOffcanvas: () => void;
  closeOffcanvas: () => void;
};

const UIContext = createContext < UIContextType | null > (null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  
  const openOffcanvas = () => setIsOffcanvasOpen(true);
  const closeOffcanvas = () => setIsOffcanvasOpen(false);
  
  return (
    <UIContext.Provider value={{ isOffcanvasOpen, openOffcanvas, closeOffcanvas }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI phải được dùng trong <UIProvider>');
  return ctx;
}