import { useState, useEffect } from 'react';

interface IOption {
  buildKey: (key: string) => string;
}

export const createUseLocalStorageHook = (
  storage: Storage,
  options: IOption
) => {
  const { buildKey } = options;

  function getKey(key: string) {
    return buildKey(key);
  }

  function getStorageValue<T = any>(key: string, defaultValue: T): T {
    const saved = storage.getItem(getKey(key));
    if (typeof saved === 'string') {
      try {
        return JSON.parse(saved);
      } catch (error) {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  function setStorageValue<T = any>(key: string, value: T) {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  }

  function useLocalStorage<T = any>(key: string, defaultValue: T) {
    // lazy load data to state
    const [value, setValue] = useState<T>(() => {
      return getStorageValue(key, defaultValue);
    });

    // Auto sync to local storage - whenever the value changes
    useEffect(() => {
      setStorageValue(key, value);
    }, [key, value]);
    return [value, setValue] as const;
  }

  return {
    useLocalStorage,
    getKey,
    setStorageValue,
    getStorageValue,
  };
};

export default createUseLocalStorageHook(localStorage, {
  buildKey: k => k,
});
