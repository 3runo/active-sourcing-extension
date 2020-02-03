import { curryN, compose, reduce } from 'lodash/fp';
import { domainWhiteList } from './constants';
import {
  concatStringList,
  debug,
  findWhiteListedString,
  getTextNodes,
  nodeListToArray,
} from './pure';
import {
  categorizeContactInfoText,
  contactInfoTextsToObj,
  findDomData,
  getTextFromNodes,
  serializeDomData,
  TLCodeData,
} from './linkedin';

type StringObj = Record<string, string>;

function formElementReducer(obj: StringObj, e: HTMLInputElement) {
  obj[e.name.replace('input-', '')] = e.value;
  return obj;
}

const findAllowedString = curryN(2, findWhiteListedString)(domainWhiteList);
const isDomainAllowed = compose([Boolean, findAllowedString]);
const getContactInfoText = compose([
  contactInfoTextsToObj,
  debug,
  categorizeContactInfoText,
  getTextNodes,
]);

const getDataFromCodeTag: (list: NodeListOf<Element>) => TLCodeData = compose([
  serializeDomData,
  findDomData,
  getTextFromNodes,
]);

const getConcatenatedTextFrom: (e: HTMLElement) => string = compose([
  concatStringList,
  getTextFromNodes,
  getTextNodes,
]);

const createFormPayload: (list: NodeListOf<Element>) => StringObj = compose([
  reduce(formElementReducer, {}),
  nodeListToArray,
]);

export {
  createFormPayload,
  findAllowedString,
  getConcatenatedTextFrom,
  getContactInfoText,
  getDataFromCodeTag,
  isDomainAllowed,
};
