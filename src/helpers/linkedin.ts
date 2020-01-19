import { camelCase, getOr } from 'lodash/fp';
import { setProp, tryParse } from './pure';

type getOr = (s: string, o: Object) => any;
type KeyValueObj = { [k: string]: string };
type DOMData<T> = { data: RelevantMetaData; included: Array<T> };
type RelevantMetaData = { plainId?: number; premiumSubscriber?: boolean };
type RelevantProfileData = {
  firstName?: string;
  lastName?: string;
  occupation?: string | Array<string>;
  publicIdentifier?: string;
  trackingId?: string;
};

export type TLCodeData = RelevantMetaData & RelevantProfileData;

const getOrFalse: getOr = getOr(false);
const getOrVoid: getOr = getOr(undefined);

export function categorizeContactInfoText(nodes: Array<Node>): Array<string> {
  return nodes.map((n: Node) => {
    const parentClass = n.parentElement ? n.parentElement.className : '';
    const prefix = parentClass.indexOf('header') !== -1 ? 'key+' : 'value+';

    return prefix + n.textContent;
  });
}

export function contactInfoTextsToObj(data: Array<string>): KeyValueObj {
  let output: KeyValueObj = {};
  let value: string;
  let valueType: string;
  let prop: string;

  for (let i = 0, len = data.length; i < len; i++) {
    [valueType, value] = data[i].split('+');

    if (valueType === 'key') {
      prop = camelCase(value);
      output = setProp<KeyValueObj>(output, prop, '');
    } else {
      output[prop] = String(output[prop] + value).trim();
    }
  }

  return output;
}

export function findDomData(list: Array<string>) {
  return list
    .filter((s: string) => s.includes('{"data":{'))
    .map(tryParse)
    .find((o: Object) => getOrFalse('data.firstName', o));
}

export function getTextFromNodes(list: NodeListOf<Element>): Array<string> {
  return Array.prototype.slice
    .call(list)
    .map((e: Element) => e.textContent.trim());
}

export function serializeDomData(
  found: DOMData<RelevantProfileData> | undefined
) {
  return found != null
    ? {
        firstName: getOrVoid('data.firstName', found),
        lastName: getOrVoid('data.lastName', found),
        occupation: getOrVoid('data.occupation', found),
        publicIdentifier: getOrVoid('data.publicIdentifier', found),
        trackingId: getOrVoid('data.trackingId', found),
        plainId: getOrVoid('data.plainId', found),
        premiumSubscriber: getOrVoid('data.premiumSubscriber', found),
      }
    : undefined;
}
