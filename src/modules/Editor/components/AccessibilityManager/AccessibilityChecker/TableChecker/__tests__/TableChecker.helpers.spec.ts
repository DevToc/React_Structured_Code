import { checkTableHeading, hasTables } from '../TableChecker.helpers';
import { generatePageData, generatePageDataWithoutTable } from './mockData';

describe('AccessibilityManager/TableChecker/TableChecker.helpers', () => {
  it('should return an array contains one invalid widget for table without headers', () => {
    const pageData = generatePageData();

    const result = checkTableHeading(pageData);
    expect(result.length).toEqual(1);
  });

  it('should return an array contains one invalid widget for table with headers', () => {
    const pageData = generatePageData(true);

    const result = checkTableHeading(pageData);
    expect(result.length).toEqual(1);
  });

  it('should return true if design has table', () => {
    const pageData = generatePageData(true);

    const result = hasTables(pageData);
    expect(result).toBeTruthy();
  });

  it('should return false if design no table', () => {
    const pageData = generatePageDataWithoutTable();

    const result = hasTables(pageData);
    expect(result).toBeFalsy();
  });
});
