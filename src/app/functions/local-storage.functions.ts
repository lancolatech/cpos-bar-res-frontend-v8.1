/**
 * Saves a value to the browser's local storage.
 * @param key - The key to use to store the value in local storage.
 * @param value - The value to store in local storage. Will be converted to a JSON string.
 */
export function saveToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from the browser's local storage.
 * @param key - The key to use to retrieve the value from local storage.
 * @returns The value associated with the provided key, parsed from the stored JSON string.
 */
export function getFromLocalStorage(key: string) {
  const value: any = localStorage.getItem(key) || null;
  return JSON.parse(value);
}
