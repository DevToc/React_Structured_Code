import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { SettingsAccordion, SettingsAccordionToggle } from '../ChartSettingsAccordion';

describe('ChartSettingsAccordion.tsx', () => {
  global.window.scrollTo = jest.fn();

  it('should render the SettingsAccordion', () => {
    const { container } = render(
      <SettingsAccordion title='Settings Title'>
        <div>settings accordion child</div>
      </SettingsAccordion>,
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('settings accordion child')).toBeInTheDocument();
    expect(screen.getByText('Settings Title')).toBeInTheDocument();
  });

  // should be open if isDefaultOpen is passed
  it('should be open if isDefaultOpen is passed', () => {
    render(
      <SettingsAccordion title='Settings Title' isDefaultOpen>
        <div>settings accordion child</div>
      </SettingsAccordion>,
    );

    expect(screen.getByRole('button', { name: 'Settings Title' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('should render the SettingsAccordionToggle', () => {
    const { container } = render(
      <SettingsAccordionToggle isChecked onToggle={() => {}} title='SettingsAccordionToggle Title'>
        <div>SettingsAccordionToggle child</div>
      </SettingsAccordionToggle>,
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('SettingsAccordionToggle child')).toBeInTheDocument();
    expect(screen.getByText('SettingsAccordionToggle Title')).toBeInTheDocument();
  });

  it('should toggle the SettingsAccordionToggle', async () => {
    const onToggle = jest.fn(() => {});
    render(
      <SettingsAccordionToggle isChecked onToggle={onToggle} title='SettingsAccordionToggle Title'>
        <div>SettingsAccordionToggle child</div>
      </SettingsAccordionToggle>,
    );

    const toggleButton = screen.getByRole('button', { name: 'SettingsAccordionToggle Title' });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });
});
