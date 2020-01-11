import * as browser from 'webextension-polyfill';
import { curryN, compose } from 'lodash/fp';
import { domainWhiteList } from './core/constants';
import { findWhiteListedString } from './core/pure';

type InitParams = { previousVersion: string; reason: string };
type NavParams = {
  frameId?: number;
  parentFrameId?: number;
  tabId: number;
  timeStamp: number;
  url: string;
};

const findAllowedString = curryN(2, findWhiteListedString)(domainWhiteList);
const isDomainAllowed = compose([Boolean, findAllowedString]);

function initExtension(_: InitParams) {
  console.log(_);
}

function onWebNavigationCompleted({ parentFrameId, tabId, url }: NavParams) {
  console.log(isDomainAllowed(url));
  if (parentFrameId !== -1 || !isDomainAllowed(url)) return;
  console.log('green light');
}

browser.runtime.onInstalled.addListener(initExtension);
browser.webNavigation.onCompleted.addListener(onWebNavigationCompleted);
