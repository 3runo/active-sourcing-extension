import {
  binarySearch,
  factorial,
  factorialRecursive,
  factorialRecursiveTCO,
  mergeSort,
  setProp,
  sortNumImpure,
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

describe('sort algorithm', () => {
  it('should return every items from the original list sorted', () => {
    const list = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const result = sortNumImpure(list);

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should return every items from the original list sorted, without mutate it', () => {
    const list = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const doubleList = [4, 1, 4, 5, 5, 3, 2, 3, 2, 1];

    expect(mergeSort(list)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(mergeSort(doubleList)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
  });
});

describe('search algorithm', () => {
  it('should return the correct index of the given number', () => {
    const sortedList = [2, 2, 3, 3, 3, 4, 5, 6, 13, 23, 83, 645];
    const indexOf0 = binarySearch(sortedList, 0);
    const indexOf2 = binarySearch(sortedList, 2);
    const indexOf5 = binarySearch(sortedList, 5);
    const indexOf83 = binarySearch(sortedList, 83);
    const indexOf645 = binarySearch(sortedList, 645);

    expect(indexOf0).toEqual(-1);
    expect(indexOf2).toEqual(0);
    expect(indexOf5).toEqual(6);
    expect(indexOf83).toEqual(10);
    expect(indexOf645).toEqual(11);
  });
});
