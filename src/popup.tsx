import * as React from 'react';
import { render } from 'react-dom';
import * as browser from 'webextension-polyfill';
import { activeTab } from './helpers/constants';
import { isDomainAllowed } from './helpers';

const fetchTabs = browser.tabs.query;
const messageListener = browser.runtime.onMessage.addListener;

type RMEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type Tabs = Array<chrome.tabs.Tab>;
type State = { isScanDisabled: boolean };
type Profile = { profileName: string };
type Response = Profile | { err: string };

class PopupApp extends React.Component<{}, State> {
  state = { isScanDisabled: true };
  componentDidMount() {
    // Check scan possibility
    fetchTabs(activeTab).then(([firsTab]: Tabs) => {
      this.setState({ isScanDisabled: !isDomainAllowed(firsTab.url) });
    });

    // Receive the results of scan process
    messageListener((response: Response) => {
      console.log('popup =>', response);
    });
  }

  onScanDomainClick = (e: RMEvent) => {
    fetchTabs(activeTab).then(([firsTab]: Tabs) => {
      if (!isDomainAllowed(firsTab.url)) return;
      browser.tabs.sendMessage(firsTab.id, firsTab.url);
    });
  };

  render() {
    return (
      <>
        <h3 className="title">Active Sourcing</h3>
        <div className="content">
          <button
            className="Btn"
            onClick={this.onScanDomainClick}
            disabled={this.state.isScanDisabled}
          >
            Scan profile
          </button>
        </div>
      </>
    );
  }
}

render(<PopupApp />, document.getElementById('popup'));
