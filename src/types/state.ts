import { TLCodeData } from '../helpers/linkedin';

export type Tabs = Array<chrome.tabs.Tab>;
export type State = LProfile & {
  msg: string;
  isProcessing: boolean;
  isScanDisabled: boolean;
};
export type LProfile = TLCodeData & {
  about?: string;
  birthday?: string;
  connected?: string;
  education?: string | Array<string>;
  email?: string;
  im?: string;
  location?: string;
  profileName?: string;
  twitter?: string;
  yourProfile?: string;
};
