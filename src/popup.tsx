import * as React from 'react';
import { render } from 'react-dom';
import { curryN, compose, getOr } from 'lodash/fp';
import * as browser from 'webextension-polyfill';
import { activeTab, domainWhiteList } from './core/constants';
import { validateWhiteListEntry, debug } from './core/pure';

type RMEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type Tabs = Array<chrome.tabs.Tab>;

const getValidatedDomain: (e: RMEvent) => string | undefined = compose([
  curryN(2, validateWhiteListEntry)(domainWhiteList),
  getOr('', 'currentTarget.dataset.domain'),
]);

class PopupApp extends React.Component<{}, {}> {
  componentDidMount() {}
  componentWillUnmount() {}
  onScanDomainClick = (e: RMEvent) => {
    const domain = getValidatedDomain(e);
    if (!domain) return;

    browser.tabs.query(activeTab).then(([firsTab]: Tabs) => {
      browser.tabs.sendMessage(firsTab.id, `scan_${domain}_dom`);
      // if domain is linked in, it is possible to get information from tab
      // console.log(firsTab.url);
      // console.log(firsTab.title);
    });
  };
  render() {
    return (
      <>
        <h1>Active Sourcing</h1>
        <div className="content">
          <button
            className="Btn"
            data-domain="linkedin"
            onClick={this.onScanDomainClick}
          >
            LinkedIn
          </button>
          &nbsp;
          <button
            className="Btn"
            data-domain="xing"
            onClick={this.onScanDomainClick}
          >
            XING
          </button>
        </div>
      </>
    );
  }
}

render(<PopupApp />, document.getElementById('popup'));
