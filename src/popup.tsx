import * as React from 'react';
import { render } from 'react-dom';
import * as browser from 'webextension-polyfill';
import { activeTab } from './helpers/constants';
import {
  createFormPayload,
  isDomainAllowed,
  getFullName,
  cleanedState,
} from './helpers';
import { postSaveProfile } from './helpers/api';
import { Tabs, State } from './types/state';
import Field from './components/uncontrolled-field/';

const fetchTabs = browser.tabs.query;
const messageListener = browser.runtime.onMessage.addListener;
const hasProp = Object.prototype.hasOwnProperty;
const initialState = {
  isProcessing: false,
  isScanDisabled: true,
  msg: '',
};

class PopupApp extends React.Component<{}, State> {
  state: State = initialState;
  componentDidMount() {
    // Check scan possibility
    fetchTabs(activeTab).then(([firsTab]: Tabs) => {
      this.setState({ isScanDisabled: !isDomainAllowed(firsTab.url) });
    });

    // Receive the results of scan process
    messageListener((data: Record<string, any>) => {
      if (hasProp.call(data, 'err')) {
        console.error(data.err);
        return;
      }

      this.setState((state) => {
        return {
          about: data.about || state.about,
          birthday: data.birthday || state.birthday,
          connected: data.connected || state.connected,
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
          twitter: data.twitter || state.twitter,
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

        this.setState({
          yourProfile: firsTab.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, ''),
        });
      }
    });
  };

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = createFormPayload(form.querySelectorAll('[name*="input"]'));

    this.setState({ isProcessing: true });

    postSaveProfile(payload)
      .then(() => this.setState({ ...cleanedState, msg: 'success message' }))
      .catch((res) => this.setState({ msg: res.message || 'error message' }))
      .then(() => {
        this.setState({ isProcessing: false });
        window.setTimeout(() => this.setState({ msg: '' }), 2000);
      });
  };

  render() {
    const {
      about,
      birthday,
      email,
      im,
      isProcessing,
      isScanDisabled,
      msg,
      occupation,
      twitter,
      yourProfile,
    } = this.state;

    return (
      <>
        <h3 className="title">Active Sourcing</h3>
        <div className="content">
          <div className="alignRight">
            <button
              className="Btn gapB3"
              onClick={this.onScanDomainClick}
              disabled={isScanDisabled || isProcessing}
            >
              Scan profile
            </button>
          </div>
          {this.state.profileName != null && (
            <form onSubmit={this.onFormSubmit}>
              <Field
                label="Name"
                name="input-name"
                value={getFullName(this.state)}
              />
              {email != null && (
                <Field label="Email" name="input-email" value={email} />
              )}
              {occupation != null && (
                <Field
                  label="Occupation"
                  name="input-occupation"
                  value={occupation}
                />
              )}
              {birthday != null && (
                <Field
                  label="Birthday"
                  name="input-birthday"
                  value={birthday}
                />
              )}
              {yourProfile != null && (
                <Field
                  label="Profile"
                  name="input-profile"
                  value={yourProfile}
                />
              )}
              {twitter != null && (
                <Field label="Twitter" name="input-twitter" value={twitter} />
              )}
              {im != null && <Field label="IM" name="input-im" value={im} />}
              {about != null && (
                <div className="formGroup">
                  <label htmlFor="input-about">About</label>
                  <textarea
                    name="input-about"
                    id=""
                    rows={2}
                    defaultValue={about}
                  />
                </div>
              )}
              <div className="formGroup">
                <button
                  className="Btn alignRight"
                  disabled={isScanDisabled || isProcessing}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          {msg.length > 0 && <div className="feedBackMessage">{msg}</div>}
        </div>
      </>
    );
  }
}

render(<PopupApp />, document.getElementById('popup'));
