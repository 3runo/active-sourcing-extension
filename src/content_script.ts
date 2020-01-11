import * as browser from 'webextension-polyfill';

const d: Document = window.document;

function reactToContactInfoChanges(
  mutations: MutationRecord[],
  observerRef: MutationObserver
) {
  const dismissBtnS = 'button[aria-label="Dismiss"]';

  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      let $target = mutation.target as HTMLElement;
      let $links = $target.querySelectorAll('a');
      let $closeBtn: HTMLElement = $target.querySelector(dismissBtnS);

      if ($links.length > 0 && $closeBtn) {
        $closeBtn.click();
        observerRef.disconnect();
        console.log($links);
        // Implementing contact info extraction ...
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

  // Start contact info modal observer
  contactInfoObserver.observe($observedNode, observerConfig);

  // Open contact info modal
  if ($seeMoreLink != null) {
    $seeMoreLink.click();
  }

  console.log('profileName =>', profileName);
}

function onMessageReceived(message: string) {
  // if (message === 'scan_xing_dom') {}
  if (message === 'scan_linkedin_dom') {
    scanLinkedIn();
  }
}

browser.runtime.onMessage.addListener(onMessageReceived);
