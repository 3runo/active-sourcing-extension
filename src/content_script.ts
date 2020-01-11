const d: Document = window.document;
const contactInfoSel = 'a[data-control-name="contact_see_more"]';
const contactInfoCloseSel = 'button[aria-label="Dismiss"]';
const contactInfoModalSel = '#artdeco-modal-outlet';

const profileName = d.title.replace('| LinkedIn', '').trim();

// Open contact info modal
const $seeMoreLink: HTMLElement = d.querySelector(contactInfoSel);
if ($seeMoreLink) $seeMoreLink.click();

// MutationObserver
function onContactInfoChange(record: MutationRecord[], ref: MutationObserver) {
  for (let mutation of record) {
    if (mutation.type === 'childList') {
      const $target = mutation.target as HTMLElement;
      const $links = $target.querySelectorAll('a');
      const $closeBtn: HTMLElement = $target.querySelector(contactInfoCloseSel);

      if ($links.length > 0 && $closeBtn) {
        $closeBtn.click();
        ref.disconnect();
        console.log($links);
      }

      console.log('A child node has been added or removed.', mutation);
    }
  }
}
const contactInfoObserver = new MutationObserver(onContactInfoChange);
const observedNode = d.querySelector(contactInfoModalSel);
const config = { attributes: false, childList: true, subtree: true };
contactInfoObserver.observe(d.querySelector(contactInfoModalSel), config);

console.log('profileName =>', profileName);
