import { useContext } from 'react';
import { AccessibilitySettingsContext } from '../AccessibilityManager.config';

const useAccessibilityChecker = () => useContext(AccessibilitySettingsContext);

export { useAccessibilityChecker };
