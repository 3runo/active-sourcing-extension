import { replace } from 'lodash/fp';
import * as browser from 'webextension-polyfill';
import {
  findAllowedString,
  getConcatenatedTextFrom,
  getContactInfoText,
  getDataFromCodeTag,
} from './helpers';
import { nodeListToArray, NodeList, getTextNodes } from './helpers/pure';

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
  const $contactSeeMoreLink: HTMLElement = d.querySelector('a[data-control-name="contact_see_more"]'); // prettier-ignore
  const $contactObservedNode = d.querySelector('#artdeco-modal-outlet');
  const domJsonData = getDataFromCodeTag(d.querySelectorAll('body > code'));
  const $aboutParagraph: HTMLElement = d.querySelector('.pv-about-section > .pv-about__summary-text'); // prettier-ignore
  const $aboutSeeLink: HTMLElement = d.querySelector('a.lt-line-clamp__more');

  if (domJsonData != null) {
    respond(domJsonData);
  }

  if ($aboutSeeLink != null) {
    $aboutSeeLink.click();
    const paragraph = getConcatenatedTextFrom($aboutParagraph);
    const about = replace(`...${$aboutSeeLink.textContent}`, '', paragraph);

    respond({ about });
  }

  if ($contactSeeMoreLink != null && $contactObservedNode != null) {
    const config = { attributes: false, childList: true, subtree: true };
    const contactInfoObserver = new MutationObserver(reactToContactInfoChanges);

    contactInfoObserver.observe($contactObservedNode, config);
    $contactSeeMoreLink.click();
  } else {
    respond({ err: 'linkedinContactInfoModalError' });
  }

  // experience-section (3 last experiences)
  // pv-skill-categories-section__top-skills pv-profile-section__section-info section-info pb1 (Skills & Endorsements)
  // education

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
