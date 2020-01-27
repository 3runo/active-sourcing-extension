import { curryN } from 'lodash/fp';
export type NodeList = NodeListOf<HTMLElement>;

function defaultCompare(a: number, b: number) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function equal(a: number, b: number) {
  return defaultCompare(a, b) === 0;
}

function lessThan(a: number, b: number) {
  return defaultCompare(a, b) < 0;
}

function lessThanOrEqual(a: number, b: number) {
  return lessThan(a, b) || equal(a, b);
}

export function comparePartialString(fullStr: string, partialStr: string) {
  return fullStr.indexOf(partialStr) !== -1;
}

export function concatStringList(list: Array<string>) {
  return list.join('');
}

export function findWhiteListedString(whiteList: string[], fullStr: string) {
  const findValueInList = curryN(2, comparePartialString)(fullStr);
  return whiteList.find(findValueInList);
}

export function getTextNodes(element?: HTMLElement): Array<Node> {
  if (!element) return [];

  let curr: Node;
  let output: Array<Node> = [];
  let walker: TreeWalker = window.document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false); // prettier-ignore

  while ((curr = walker.nextNode())) {
    if (typeof curr.textContent === 'string' && curr.textContent.trim()) {
      output.push(curr);
    }
  }

  return output;
}

export function nodeListToArray(list: NodeList): Array<HTMLElement> {
  return Array.prototype.slice.call(list);
}

export function setProp<T>(obj: T, key: string, value: any = ''): T {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj;
  }

  return { ...obj, [key]: value };
}

export function tryParse(str: string): Object {
  try {
    return JSON.parse(str);
  } catch (error) {
    return Object.create(null);
  }
}

export function validateWhiteListEntry(
  [head, ...rest]: Array<string>,
  entry: string
): string | undefined {
  const isValid = comparePartialString(head, entry);
  if (isValid) return entry;
  return rest.length < 1 ? undefined : validateWhiteListEntry(rest, entry);
}

export function debug(arg: any) {
  console.log(arg);
  return arg;
}

export function factorial(number: number) {
  let result = 1;

  for (let i = 2; i <= number; i = i + 1) {
    result = result * i;
  }

  return result;
}

export function factorialRecursive(number: number) {
  return number > 1 ? number * factorialRecursive(number - 1) : 1;
}

export function factorialRecursiveTCO(number: number, result = 1) {
  return number === 0
    ? result
    : factorialRecursiveTCO(number - 1, number * result);
}

export function sortNumImpure(list: Array<number>) {
  return list.sort((a, b) => a - b);
}

export function binarySearch(sortedList: Array<number>, number: number) {
  let max = sortedList.length - 1;
  let min = 0;
  let mid = 0;

  while (min <= max) {
    mid = Math.floor((max + min) / 2);

    if (sortedList[mid] === number) {
      return mid;
    } else if (sortedList[mid] < number) {
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }

  return -1;
}

export function mergeSort(list: Array<number>) {
  if (list.length <= 1) return list;

  const midIndex = Math.floor(list.length / 2); // Split array on two halves.

  // Sort two halves of split array
  const leftSorted = mergeSort(list.slice(0, midIndex));
  const rightSorted = mergeSort(list.slice(midIndex, list.length));

  return mergeSortedArrays(leftSorted, rightSorted);
}

export function mergeSortedArrays(left: Array<number>, right: Array<number>) {
  let sortedList = [];
  let minimumItem = null;

  // In case if arrays are not of size 1.
  while (left.length && right.length) {
    // Find minimum element of two arrays.
    minimumItem = lessThanOrEqual(left[0], right[0])
      ? left.shift()
      : right.shift();

    // Push the minimum element of two arrays to the sorted array.
    sortedList.push(minimumItem);
  }

  // If one of two array still have elements we need to just concatenate
  // this element to the sorted array since it is already sorted.
  if (left.length) {
    sortedList = sortedList.concat(left);
  }

  if (right.length) {
    sortedList = sortedList.concat(right);
  }

  return sortedList;
}
