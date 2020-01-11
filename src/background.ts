import browser from 'webextension-polyfill';
import curryN from 'lodash/fp/curryN';
import { compareWhiteList } from './core/pure';

type InitParams = { previousVersion: string; reason: string };
type NavParams = {
  frameId?: number;
  parentFrameId?: number;
  tabId: number;
  timeStamp: number;
  url: string;
};

const isDomainAllowed = curryN(2, compareWhiteList)(['www.linkedin.com']);

function initExtension(_: InitParams) {
  console.log(_);
}

function onWebNavigationCompleted({ parentFrameId, tabId, url }: NavParams) {
  if (parentFrameId !== -1 || !isDomainAllowed(url)) return;
  // implement allowed domain logic here
}

browser.runtime.onInstalled.addListener(initExtension);
browser.webNavigation.onCompleted.addListener(onWebNavigationCompleted);
