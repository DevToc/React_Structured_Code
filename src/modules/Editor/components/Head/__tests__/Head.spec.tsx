import { renderWithRedux } from '../../../../../utils/test-utils.test';
import { InfographLoader } from '../../../../InfographLoader';
import { SAMPLE_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

import { Head } from '../Head';

describe('components/Head', () => {
  it('should set infograph title as page title', () => {
    renderWithRedux(
      <InfographLoader infographState={SAMPLE_INFOGRAPH}>
        <Head />
      </InfographLoader>,
    );
    expect(document.title).toEqual('Hello world first infograph | Venngage');
  });
});
