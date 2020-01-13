import * as browser from 'webextension-polyfill';
import { findAllowedString } from './helpers';
import { getTextNodes } from './helpers/pure';

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
      // let $links = $target.querySelectorAll('a');
      // 'pv-profile-section__section-info section-info'
      if ($closeBtn != null && $sectionInfo != null) {
        console.log('debug: ', getTextNodes($sectionInfo), $sectionInfo);
        $closeBtn.click();
        observerRef.disconnect();
      }
    }
  }
}

function scanLinkedIn() {
  const seeMoreLinkS = 'a[data-control-name="contact_see_more"]';
  const contactInfoModalS = '#artdeco-modal-outlet';
  const profileName = d.title.replace('| LinkedIn', '').trim();
  const observerConfig = { attributes: false, childList: true, subtree: true };
  const $seeMoreLink: HTMLElement = d.querySelector(seeMoreLinkS);
  const $observedNode = d.querySelector(contactInfoModalS);
  const contactInfoObserver = new MutationObserver(reactToContactInfoChanges);

  if ($seeMoreLink != null && $observedNode != null) {
    contactInfoObserver.observe($observedNode, observerConfig);
    $seeMoreLink.click();
    respond({ profileName });
  } else {
    respond({ err: 'linkedin_node_error' });
  }
}

function onMessageReceived(message: string) {
  // if (message === 'www.xing.com') {}
  if (findAllowedString(message) === 'www.linkedin.com') {
    scanLinkedIn();
  }
}

browser.runtime.onMessage.addListener(onMessageReceived);
