import * as browser from 'webextension-polyfill';
import {
  findAllowedString,
  getConcatenatedTextFrom,
  getContactInfoText,
  getDataFromCodeTag,
} from './helpers';
import { nodeListToArray, NodeList } from './helpers/pure';

const d: Document = window.document;
const respond = browser.runtime.sendMessage;

function addStringReducer(acc: Array<any>, element: HTMLElement) {
  return [...acc, getConcatenatedTextFrom(element)];
}

function reactToContactInfoChanges(
  mutations: MutationRecord[],
  observerRef: MutationObserver
) {
  const dismissBtnS = 'button[aria-label="Dismiss"]';

  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      let $target = mutation.target as HTMLElement;
      let $closeBtn: HTMLElement = $target.querySelector(dismissBtnS);
      let $sectionInfo: HTMLElement = $target.querySelector('.section-info');

      if ($closeBtn != null && $sectionInfo != null) {
        respond(getContactInfoText($sectionInfo));
        $closeBtn.click();
        observerRef.disconnect();
      }
    }
  }
}

function scanLinkedIn() {
  const profileName = d.title.replace('| LinkedIn', '').trim();
  const $seeMoreLink: HTMLElement = d.querySelector('a[data-control-name="contact_see_more"]'); // prettier-ignore
  const $observedNode = d.querySelector('#artdeco-modal-outlet');
  const codeData = getDataFromCodeTag(d.querySelectorAll('body > code'));

  if (codeData != null) {
    respond(codeData);
  }

  if ($seeMoreLink != null && $observedNode != null) {
    const config = { attributes: false, childList: true, subtree: true };
    const contactInfoObserver = new MutationObserver(reactToContactInfoChanges);

    contactInfoObserver.observe($observedNode, config);
    $seeMoreLink.click();
  } else {
    respond({ err: 'linkedin_node_error' });
  }

  respond({ profileName });
}

function scanXing() {
  const $name: HTMLElement = d.querySelector('[data-qa="malt-profile-display-name"]'); // prettier-ignore
  const $occupation: NodeList = d.querySelectorAll('[data-qa="profile-occupation-work_experience"]'); // prettier-ignore
  const $education: NodeList = d.querySelectorAll('[data-qa="profile-occupation-education"]'); // prettier-ignore
  const $location: HTMLElement= d.querySelector('[data-qa="profile-location"]'); // prettier-ignore

  respond({
    profileName: getConcatenatedTextFrom($name),
    occupation: nodeListToArray($occupation).reduce(addStringReducer, []),
    education: nodeListToArray($education).reduce(addStringReducer, []),
    location: getConcatenatedTextFrom($location),
  });
}

function onMessageReceived(message: string) {
  const whiteListedDomain = findAllowedString(message);

  if (whiteListedDomain === 'www.xing.com') {
    scanXing();
  } else if (whiteListedDomain === 'www.linkedin.com') {
    scanLinkedIn();
  }
}

browser.runtime.onMessage.addListener(onMessageReceived);
