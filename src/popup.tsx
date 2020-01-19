import * as React from 'react';
import { render } from 'react-dom';
import * as browser from 'webextension-polyfill';
import { activeTab } from './helpers/constants';
import { isDomainAllowed } from './helpers';
import { TLCodeData } from './helpers/linkedin';

const fetchTabs = browser.tabs.query;
const messageListener = browser.runtime.onMessage.addListener;

// type RMEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type Tabs = Array<chrome.tabs.Tab>;
type State = LProfile & { isScanDisabled: boolean };
type Response = LProfile | { err: string };
type LProfile = TLCodeData & {
  birthday?: string;
  email?: string;
  im?: string;
  profileName?: string;
  yourProfile?: string;
  education?: string | Array<string>;
  location?: string;
  about?: string;
};

class PopupApp extends React.Component<{}, State> {
  state = { isScanDisabled: true };
  componentDidMount() {
    // Check scan possibility
    fetchTabs(activeTab).then(([firsTab]: Tabs) => {
      this.setState({ isScanDisabled: !isDomainAllowed(firsTab.url) });
    });

    // Receive the results of scan process
    // ToDo: revisit data typing here
    messageListener((data: any) => {
      if (Object.prototype.hasOwnProperty.call(data, 'err')) {
        console.error(data.err);
        return;
      }

      this.setState((state) => {
        return {
          about: data.about || state.about,
          birthday: data.birthday || state.birthday,
          email: data.email || state.email,
          firstName: data.firstName || state.firstName,
          im: data.im || state.im,
          lastName: data.lastName || state.lastName,
          occupation: data.occupation || state.occupation,
          plainId: data.plainId || state.plainId,
          premiumSubscriber: data.premiumSubscriber || state.premiumSubscriber,
          profileName: data.profileName || state.profileName,
          publicIdentifier: data.publicIdentifier || state.publicIdentifier,
          trackingId: data.trackingId || state.trackingId,
          yourProfile: data.yourProfile || state.yourProfile,
        };
      });
    });
  }

  onScanDomainClick = () => {
    fetchTabs(activeTab).then(([firsTab]: Tabs) => {
      if (isDomainAllowed(firsTab.url)) {
        browser.tabs
          .sendMessage(firsTab.id, firsTab.url)
          .then(console.info)
          .catch(console.error);
      }
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
          <pre>{JSON.stringify(this.state, null, 1)}</pre>
        </div>
      </>
    );
  }
}

render(<PopupApp />, document.getElementById('popup'));
