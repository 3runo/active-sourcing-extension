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
import { State } from '../types/state';

type StringObj = Record<string, string>;

function formElementReducer(obj: StringObj, e: HTMLInputElement) {
  obj[e.name.replace('input-', '')] = e.value;
  return obj;
}

function getFullName({ lastName, firstName, profileName }: State) {
  return firstName && lastName ? `${firstName} ${lastName}` : profileName;
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

const cleanedState = [
  'about',
  'birthday',
  'connected',
  'email',
  'firstName',
  'im',
  'lastName',
  'occupation',
  'plainId',
  'premiumSubscriber',
  'profileName',
  'publicIdentifier',
  'trackingId',
  'twitter',
  'yourProfile',
].reduce((state, prop) => {
  state[prop] = undefined;
  return state;
}, Object.create(null));

export {
  cleanedState,
  createFormPayload,
  findAllowedString,
  getConcatenatedTextFrom,
  getContactInfoText,
  getDataFromCodeTag,
  getFullName,
  isDomainAllowed,
};
