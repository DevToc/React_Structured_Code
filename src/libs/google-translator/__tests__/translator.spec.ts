import { detectLanguage } from 'libs/google-translator';

describe('libs/google-translator', () => {
  it('should return english language iso639 code', async () => {
    const language = await detectLanguage('hello world');

    expect(language).toEqual('en');
  });

  it('should return empty code if giving text content has few characters.', async () => {
    const language = await detectLanguage('abc');

    expect(language).toEqual('');
  });
});
