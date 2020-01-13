import { curryN } from 'lodash/fp';

export function comparePartialString(fullStr: string, partialStr: string) {
  return fullStr.indexOf(partialStr) !== -1;
}

export function findWhiteListedString(whiteList: string[], fullStr: string) {
  const findValueInList = curryN(2, comparePartialString)(fullStr);
  return whiteList.find(findValueInList);
}

export function validateWhiteListEntry(
  [head, ...rest]: string[],
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
  if (element == null) return [];

  const walker = window.document.createTreeWalker;
  let node: Node;
  let array: Array<Node> = [];
  let walk: TreeWalker = walker(element, NodeFilter.SHOW_TEXT, null, false);

  while ((node = walk.nextNode())) {
    if (typeof node.textContent === 'string' && node.textContent.trim()) {
      array.push(node);
    }
  }

  return array;
}
// let prefix: string = '';
// console.log(node.parentElement.className.indexOf('header'))
// console.log(node.parentElement.className.indexOf('contact-item'))
// Impure
// prefix =
//   node.parentElement.className.indexOf('header') !== -1 ? 'header+' : 'item+';
// array.push(prefix + node.textContent);
