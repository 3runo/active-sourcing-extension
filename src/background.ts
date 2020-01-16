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

function initExtension(_: InitParams) {}

function onWebNavigationCompleted({ parentFrameId, tabId, url }: NavParams) {
  if (parentFrameId !== -1 || !isDomainAllowed(url)) return;
  // Either linkedin or xing
}

browser.runtime.onInstalled.addListener(initExtension);
browser.webNavigation.onCompleted.addListener(onWebNavigationCompleted);
