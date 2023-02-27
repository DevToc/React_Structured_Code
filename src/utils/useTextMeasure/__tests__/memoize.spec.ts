import memoize from '../memoize';

describe('hooks/useTextMeasure/memoize', () => {
  it('should create memo function', async () => {
    const capitalize = jest.fn((text: string) => text.toLocaleUpperCase());
    const keyResolver = (text: string) => text;
    const memoizeCapitalize = memoize(capitalize, keyResolver);

    const text = 'awesome';
    expect(memoizeCapitalize).toBeInstanceOf(Function);
    expect(memoizeCapitalize(text)).toEqual(text.toLocaleUpperCase());
  });

  it('should memorize heavy computation', async () => {
    const text = 'awesome';
    const textStyle = { fontFamily: 'Inter' };
    const heavyComputation = jest.fn();
    const keyResolver = (text: string, style: typeof textStyle) => `${text}_${JSON.stringify(style)}`;
    const memoizeComplexComputation = memoize(heavyComputation, keyResolver);

    memoizeComplexComputation(text, textStyle);
    memoizeComplexComputation(text, textStyle);

    expect(heavyComputation).toBeCalledTimes(1);
  });
});
