export function compareWhiteList(list: string[], value: string): boolean {
  return list.find((s) => value.indexOf(s) !== -1) !== undefined;
}
