import * as browser from 'webextension-polyfill';
import { findAllowedString, getCodeData, getContactInfoText } from './helpers';

const d: Document = window.document;
const respond = browser.runtime.sendMessage;

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
  const codeData = getCodeData(d.querySelectorAll('body > code'));

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

function onMessageReceived(message: string) {
  // if (message === 'www.xing.com') {}
  if (findAllowedString(message) === 'www.linkedin.com') {
    scanLinkedIn();
  }
}

browser.runtime.onMessage.addListener(onMessageReceived);
