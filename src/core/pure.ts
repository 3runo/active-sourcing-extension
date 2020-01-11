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
