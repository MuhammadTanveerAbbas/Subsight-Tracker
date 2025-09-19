"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import type { Subscription } from "@/lib/types";

const IS_SERVER = typeof window === "undefined";

// Custom hook for robust localStorage synchronization
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, boolean] {
  const [loading, setLoading] = useState(true);
  const [storedValue, setStoredValue] = useState(() => {
    if (IS_SERVER) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    } finally {
      // setLoading(false) should be in useEffect to avoid server/client mismatch
    }
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const setValue = (value: T | ((val: T) => T)) => {
    if (IS_SERVER) {
      console.warn(`Tried to set localStorage key “${key}” on the server.`);
      return;
    }
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue, loading];
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  importSubscriptions: (newSubscriptions: Subscription[]) => void;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions, loading] = useLocalStorage<Subscription[]>("subscriptions", []);

  const addSubscription = useCallback(
    (subscription: Omit<Subscription, "id">) => {
      const newSubscription = { ...subscription, id: crypto.randomUUID() };
      setSubscriptions([...subscriptions, newSubscription]);
    },
    [subscriptions, setSubscriptions]
  );

  const updateSubscription = useCallback(
    (id: string, updates: Partial<Subscription>) => {
      setSubscriptions(
        subscriptions.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
      );
    },
    [subscriptions, setSubscriptions]
  );

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  }, [subscriptions, setSubscriptions]);

  const importSubscriptions = useCallback((newSubscriptions: Subscription[]) => {
    if (Array.isArray(newSubscriptions)) {
        const validSubs = newSubscriptions.filter(s => s.id && s.name && s.amount);
        setSubscriptions(validSubs);
    } else {
        console.error("Import failed: data is not an array.");
    }
  }, [setSubscriptions]);

  const value = useMemo(
    () => ({
      subscriptions,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      importSubscriptions,
      loading,
    }),
    [
      subscriptions,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      importSubscriptions,
      loading,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionProvider"
    );
  }
  return context;
}
