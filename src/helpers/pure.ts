import { curryN } from 'lodash/fp';

export function comparePartialString(fullStr: string, partialStr: string) {
  return fullStr.indexOf(partialStr) !== -1;
}

export function findWhiteListedString(whiteList: string[], fullStr: string) {
  const findValueInList = curryN(2, comparePartialString)(fullStr);
  return whiteList.find(findValueInList);
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
