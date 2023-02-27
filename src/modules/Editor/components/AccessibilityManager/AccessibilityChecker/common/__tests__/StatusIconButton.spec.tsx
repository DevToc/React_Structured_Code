import { screen } from '@testing-library/react';
import { StatusIconButton } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/common/StatusIconButton';
import { AccessibilityCheckerStatus } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';
import { renderWithRedux } from 'utils/test-utils.test';

describe('AccessibilityChecker/common/StatusIconButton', () => {
  it('should render ok status', () => {
    renderWithRedux(<StatusIconButton status={AccessibilityCheckerStatus.ok} />);

    expect(screen.getByText('Pass')).toBeInTheDocument();
  });

  it('should render fail status', () => {
    renderWithRedux(<StatusIconButton status={AccessibilityCheckerStatus.fail} />);

    expect(screen.getByText('Fail')).toBeInTheDocument();
  });

  it('should render warn status', () => {
    renderWithRedux(<StatusIconButton status={AccessibilityCheckerStatus.warn} />);

    expect(screen.getByText(/Needs review/i)).toBeInTheDocument();
  });

  it('should render reviewed status', () => {
    renderWithRedux(<StatusIconButton status={AccessibilityCheckerStatus.reviewed} />);

    expect(screen.getByText(/reviewed/i)).toBeInTheDocument();
  });
});
