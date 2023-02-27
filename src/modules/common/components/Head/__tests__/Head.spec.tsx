import { render } from '@testing-library/react';
import { Head } from '../Head';

describe('components/Head', () => {
  it('should set document title', () => {
    const newTitle = 'New Title';

    render(<Head title={newTitle} />);
    expect(document.title).toEqual(newTitle);
  });
});
