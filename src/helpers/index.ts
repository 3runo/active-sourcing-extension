import { curryN, compose } from 'lodash/fp';
import { domainWhiteList } from './constants';
import { findWhiteListedString, getTextNodes, debug } from './pure';
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
  categorizeContactInfoText,
  getTextNodes,
]);

const getCodeData: (list: NodeListOf<Element>) => TLCodeData = compose([
  serializeDomData,
  debug,
  findDomData,
  getTextFromNodes,
]);

export { findAllowedString, getCodeData, getContactInfoText, isDomainAllowed };
