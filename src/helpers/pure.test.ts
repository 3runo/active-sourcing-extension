import {
  setProp,
  factorial,
  factorialRecursive,
  factorialRecursiveTCO,
} from './pure';

describe('setProp', () => {
  it('should return an object with desired property and value', () => {
    const result = setProp(Object.create(null), 'a', 1);
    expect(result).toEqual({ a: 1 });
  });

  it('should return incremented object with desired property and value', () => {
    const result = setProp({ a: 1 }, 'b', 2);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should not overwrite object property', () => {
    const result = setProp({ a: 1 }, 'a', 2);
    expect(result).toEqual({ a: 1 });
  });

  it("should return empty string when the object's value is not provided", () => {
    const result = setProp({ a: 1 }, 'b');
    expect(result).toEqual({ a: 1, b: '' });
  });
});

describe('factorial', () => {
  it('should return 120 when 5 is provided - loop', () => {
    const result = factorial(5);
    expect(result).toEqual(120);
  });
  it('should return 120 when 5 is provided - recursive', () => {
    const result = factorialRecursive(5);
    expect(result).toEqual(120);
  });
  it('should return 120 when 5 is provided - recursive tco', () => {
    const result = factorialRecursiveTCO(5);
    expect(result).toEqual(120);
  });
});
