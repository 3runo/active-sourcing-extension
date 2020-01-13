import { curryN, compose } from 'lodash/fp';
import { domainWhiteList } from './constants';
import { findWhiteListedString } from './pure';

const findAllowedString = curryN(2, findWhiteListedString)(domainWhiteList);
const isDomainAllowed = compose([Boolean, findAllowedString]);

export { findAllowedString, isDomainAllowed };
