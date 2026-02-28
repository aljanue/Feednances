"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface UserPreferencesContextType {
  currency: string;
  timeZone: string;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(
  undefined
);

interface UserPreferencesProviderProps {
  children: ReactNode;
  currency: string;
  timeZone: string;
}

export function UserPreferencesProvider({
  children,
  currency,
  timeZone,
}: UserPreferencesProviderProps) {
  return (
    <UserPreferencesContext.Provider value={{ currency, timeZone }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  
  if (context === undefined) {
    // Return sensible defaults if somehow used outside the provider
    return { currency: "EUR", timeZone: "UTC" }; 
  }
  
  return context;
}
