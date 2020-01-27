import { curryN, compose } from 'lodash/fp';
import { domainWhiteList } from './constants';
import {
  concatStringList,
  debug,
  findWhiteListedString,
  getTextNodes,
} from './pure';
import {
  categorizeContactInfoText,
  contactInfoTextsToObj,
  findDomData,
  getTextFromNodes,
  serializeDomData,
  TLCodeData,
} from './linkedin';

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

export {
  findAllowedString,
  getConcatenatedTextFrom,
  getContactInfoText,
  getDataFromCodeTag,
  isDomainAllowed,
};
