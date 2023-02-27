import { AllCheckerComponentType } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';

interface ResultContainerProps {
  thumbnailsRefs?: Array<HTMLDivElement | null>;
  scanDocument: () => void;
}

type GroupCheckerType = Array<{ type: string; props?: AllCheckerComponentType<string, unknown> }>;

export type { ResultContainerProps, GroupCheckerType };
