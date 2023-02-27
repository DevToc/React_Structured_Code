import { isProduction, isPreProduction, isPreview, isTest, isDevelopment } from '../environment';

describe('utils/environment', () => {
  test('It should not be production', () => {
    expect(isProduction).toBeFalsy();
  });

  test('It should not be preProduction', () => {
    expect(isPreProduction).toBeFalsy();
  });

  test('It should not be preview', () => {
    expect(isPreview).toBeFalsy();
  });

  test('It may be test environment', () => {
    expect(isTest).toBe(process.env.NODE_ENV === 'test');
  });

  test('It may be develop environment', () => {
    expect(isDevelopment).toBe(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test');
  });
});
