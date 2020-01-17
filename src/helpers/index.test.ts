import { domainWhiteList } from './constants';
import { findAllowedString } from './';

describe('findAllowedString', () => {
  it('should return undefined when a invalid input is provided', () => {
    const result = findAllowedString('invalid');
    expect(result).toEqual(undefined);
  });

  it('should return undefined when an empty string is provided', () => {
    const result = findAllowedString('');
    expect(result).toEqual(undefined);
  });

  it('should return a valid string when a whitelisted string is provided', () => {
    const result = findAllowedString(domainWhiteList[0]);
    expect(result).toEqual(domainWhiteList[0]);
  });
});
