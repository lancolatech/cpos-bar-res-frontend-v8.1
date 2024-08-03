/* eslint-disable prettier/prettier */
// import { SearchFieldInterface } from '../interfaces/search.interface';

/**
 * Sorts an array in descending order
 *
 * @param {string} key
 * @param {('ASC' | 'DESC')} order
 * @param {any[]} array
 * @return {*}
 * @memberof ArrayService
 */
export function sortArrayByKey(
  key: string,
  order: 'ASC' | 'DESC',
  array: any[]
) {
  return array.slice().sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA === null && valueB === null) {
      return 0; // Both values are null, consider them equal
    } else if (valueA === null) {
      return order === 'ASC' ? -1 : 1; // Nulls first for ASC, last for DESC
    } else if (valueB === null) {
      return order === 'ASC' ? 1 : -1; // Nulls last for ASC, first for DESC
    }

    // Values are not null, proceed with comparison
    if (order === 'ASC') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else if (order === 'DESC') {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }

    return 0; // Default case, consider them equal
  });
}

/**
 * Search and filter items where any of the specified search fielsa matches a search term
 *
 * @param {any[]} objectsArray
 * @param {string[]} searchFields
 * @param {string} [searchTerm]
 * @return {*}  {any[]}
 * @memberof ArrayService
 */
export function searchObjectsByFields(
  objectsArray: any[],
  searchFields: string[],
  searchTerm?: string
): any[] {
  if (!searchTerm) return objectsArray;
  if (!Array.isArray(objectsArray) || !Array.isArray(searchFields)) {
    throw new Error(
      'Invalid input: Expected arrays for objectsArray and searchFields'
    );
  }

  if (searchTerm === undefined || searchTerm === '') {
    return objectsArray;
  }

  searchTerm = searchTerm.toLowerCase();

  return objectsArray.filter((obj) => {
    return searchFields.some((field) => {
      const value = obj[field];
      if (typeof value === 'string' || value instanceof String) {
        return value.toLowerCase().includes(searchTerm!);
      }
      return false;
    });
  });
}

/**
 * Returns an array of type any to be used for search and filter
 *
 * @param {string[]} fields
 * @return {*}  {Array<any>}
 * @memberof ArrayService
 */
export function generateSearchFields(fields: any[]): any[] {
  const searchFields: Array<any> = [];
  fields.forEach((field) => {
    let data: any = field;
    if (typeof data === 'string') {
      data = {
        field,
        value: field,
        displayText: field,
      };

      searchFields.push(data);
    } else {
      searchFields.push(data);
    }
  });
  return sortArrayByKey('displayText', 'ASC', searchFields);
}

/**
 * Generates an array of field names from an array of any objects.
 *
 * @param searchFields - The array of any objects to extract the field names from.
 * @returns An array containing the field name strings.
 */
export function generateFields(searchFields: any[]): string[] {
  const fields: string[] = [];

  searchFields.forEach((field) => {
    fields.push(field.field);
  });
  return fields;
}

/**
 * Returns an array of unique field values from the given array of items.
 * Can filter to only truthy values.
 *
 * @param field - The field name to get values from
 * @param items - The array of items
 * @param options - Filtering options
 * @returns An array of unique field values
 */
export function getFieldValuesFromArray(
  field: string,
  items: any[],
  options?: { unique?: 'unique'; onlyTrueValues: 'onlyTrueValues' }
): any[] {
  const results: any[] = [];
  items.forEach((i) => {
    const value = i[field];
    if (options?.onlyTrueValues && !value) {
      return;
    }

    if (options?.unique && results.includes(value)) {
      return;
    }
    results.push(value);
  });

  return results;
}

/**
 * Combines multiple arrays into a single array, optionally removing duplicate items based on the specified keys.
 *
 * @param payload - An object containing the arrays to be combined and the optional keys to use for removing duplicates.
 * @param payload.arrays - An array of arrays to be combined.
 * @param payload.duplicateKeysToRemove - An optional array of keys to use for determining uniqueness of each item in the combined array.
 * @returns A Promise that resolves to a single array containing the combined and de-duplicated items.
 */
export async function combineArrays(payload: {
  arrays: any[][];
  duplicateKeysToRemove?: string[];
}): Promise<any[]> {
  const { arrays, duplicateKeysToRemove } = payload;

  // Flatten arrays
  const combinedArray: any[] = arrays.flat();

  if (duplicateKeysToRemove) {
    // If duplicate keys are to be removed, use removeDuplicatesByKeys function
    return removeDuplicatesByKeys(combinedArray, duplicateKeysToRemove);
  } else {
    // Otherwise, return the combined array directly
    return combinedArray;
  }
}

/**
 * Removes duplicate items from an array based on the specified keys.
 *
 * @param items - The array of items to remove duplicates from.
 * @param keys - The keys to use for determining uniqueness of each item.
 * @returns A Promise that resolves to an array of unique items.
 */
export function removeDuplicatesByKeys(
  items: any[],
  keys: string[]
): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    const seen = new Map<string, any>();

    for (const item of items) {
      const key = keys.map((k) => item[k]).join('|'); // Creating a unique key based on specified keys
      if (!seen.has(key)) {
        seen.set(key, item);
      }
    }

    // Extract unique items from the map's values
    const result = Array.from(seen.values());
    resolve(result);
  });
}

/**
 * Calculates the total value for a given field across an array of items.
 *
 * @param items - The array of items to calculate the total for.
 * @param field - The field name to sum the values from.
 * @returns The total value for the specified field across all items.
 */
export function getTotalForField(items: any[], field: string): number {
  let total = 0;

  items.forEach((item) => {
    if (!item[field] || isNaN(item[field])) {
      return;
    }
    total += item[field];
  });
  return total;
}

/**
 * Filters an array of items based on the specified field and values.
 *
 * @param payload - An object containing the following properties:
 *   - field: The field to filter the items by.
 *   - values: An array of values to include or exclude from the filtered items.
 *   - items: The array of items to filter.
 *   - mode: The filtering mode, either 'include' or 'exclude'.
 * @returns The filtered array of items.
 * @throws {Error} If the mode is not 'include' or 'exclude'.
 */
export function filterArrayBySpecifiedField(payload: {
  field: string;
  values: any[];
  items: any[];
  mode: 'include' | 'exclude';
}) {
  const { field, values, items, mode } = payload;

  // Check the mode and filter accordingly
  if (mode === 'include') {
    return items.filter((item) => values.includes(item[field]));
  } else if (mode === 'exclude') {
    return items.filter((item) => !values.includes(item[field]));
  } else {
    // If the mode is not valid, return the items unchanged or throw an error
    throw new Error('Invalid mode specified. Must be "include" or "exclude".');
  }
}

export function upsertItemInArray(payload: {
  item: any;
  array: any[];
  field: string;
  insertAtIndex?: number;
}): any[] {
  const { item, array, field, insertAtIndex } = payload;
  // Find the index of the existing item with the same field value
  const index = array.findIndex(
    (existingItem) => existingItem[field] === item[field]
  );

  if (index !== -1) {
    // If the item exists, replace it with the new item
    array[index] = item;
  } else {
    // If the item does not exist, insert it at the specified index or push it if no index specified
    if (
      insertAtIndex !== undefined &&
      insertAtIndex >= 0 &&
      insertAtIndex <= array.length
    ) {
      array.splice(insertAtIndex, 0, item);
    } else {
      array.push(item);
    }
  }

  // Return the modified array
  return array;
}

// export function filterByDateRange(dateRange: DateRangeInterface | null, items: any[], keyToFilter: string): any[] {
//     const today = new Date();
//     if (!dateRange) return items;
//     if (dateRange.startDate) {

//         const startTime = new Date(dateRange.startDate);
//         const startDate = Number(getMidnightDate((startTime)).getTime());
//         const nextDay = Number(new Date(dateRange.startDate).getTime() + (24 * 60 * 60 * 1000));
//         const filteredItemsBYStartDate: any[] = [];

//         items.forEach(item => {
//             const itemDate = Number(new Date(item[keyToFilter]).getTime() + 0);
//             // if (itemDate >= startDate && itemDate < nextDay) {
//             if (itemDate >= startDate) {
//                 filteredItemsBYStartDate.push(item);
//             }
//         });

//         // const filteredItemsBYStartDate = items.filter(item => (Number(new Date(item[keyToFilter]).getTime()) >= startDate && (Number(new Date(item[keyToFilter]).getTime())) < nextDay));

//         let filteredItems = filteredItemsBYStartDate;

//         if (dateRange.stopDate) {
//             const stopDate = Number(new Date(dateRange.stopDate).getTime() + 0);
//             const filteredByStopDate: any[] = [];
//             filteredItems.forEach(item => {
//                 const itemDate = Number(new Date(item[keyToFilter]).getTime() + 0);
//                 if (itemDate <= stopDate) {
//                     filteredByStopDate.push(item);
//                 }

//             });

//             filteredItems = filteredByStopDate;
//             // filteredItems = items.filter(item => (Number(new Date(item[keyToFilter]).getTime()) >= startDate && (Number(new Date(item[keyToFilter]).getTime())) < stopDate));
//         }

//         return filteredItems;

//     } else {

//         return items;
//     }
// }
