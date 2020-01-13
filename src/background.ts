import * as browser from 'webextension-polyfill';
import { isDomainAllowed } from './helpers';

type InitParams = { previousVersion: string; reason: string };
type NavParams = {
  frameId?: number;
  parentFrameId?: number;
  tabId: number;
  timeStamp: number;
  url: string;
};

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
