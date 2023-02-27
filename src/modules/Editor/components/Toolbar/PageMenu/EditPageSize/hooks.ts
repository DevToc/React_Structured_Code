import { FormEvent, useState, useCallback, FocusEvent, KeyboardEvent, useEffect } from 'react';
import { Code } from 'constants/keyboard';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectInfographSize } from 'modules/Editor/store/infographSelector';
import { setSize } from 'modules/Editor/store/infographSlice';
import { PageSizePreset } from 'constants/paper';
import { PageSizeUnit, PaperType } from 'types/paper.types';
import { initPageSizeMenuState, Orientation } from './config';
import { getPaperType, toPixels, format, validateSizeInput } from './helpers';

interface PageSizeControl {
  unit: PageSizeUnit;
  widthPx: number;
  heightPx: number;
  orientation: Orientation;
  paperType?: PaperType;
  handleOriengtationChange: (orientation: Orientation) => void;
  handlePaperTypeChange: (e: FormEvent<HTMLSelectElement>) => void;
  handleUnitChange: (e: FormEvent<HTMLSelectElement>) => void;
}

interface InputControlProps {
  unit: PageSizeUnit;
  size: number;
  setSize: (value: number) => void;
}

interface InputControl {
  internalValue: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

const usePageSizeControl = (): PageSizeControl => {
  // Note: we can use react context if state control gets complex
  const [state, setState] = useState(initPageSizeMenuState);
  const pageSize = useAppSelector(selectInfographSize);
  const dispatch = useAppDispatch();

  const handleOriengtationChange = useCallback(
    (orientation: Orientation) => {
      switch (orientation) {
        case Orientation.portrait:
          dispatch(
            setSize({
              size: {
                widthPx: Math.min(pageSize.widthPx, pageSize.heightPx),
                heightPx: Math.max(pageSize.widthPx, pageSize.heightPx),
              },
            }),
          );
          break;
        case Orientation.landscape:
          dispatch(
            setSize({
              size: {
                widthPx: Math.max(pageSize.widthPx, pageSize.heightPx),
                heightPx: Math.min(pageSize.widthPx, pageSize.heightPx),
              },
            }),
          );
          break;
        default:
          break;
      }
    },
    [dispatch, pageSize],
  );

  const handleUnitChange = useCallback(
    (e: FormEvent<HTMLSelectElement>) => {
      const unit = (e.target as HTMLSelectElement)?.value as PageSizeUnit;
      if (unit) setState({ ...state, unit });
    },
    [state],
  );

  const handlePaperTypeChange = useCallback(
    (e: FormEvent<HTMLSelectElement>) => {
      const value = (e.target as HTMLSelectElement)?.value as PaperType;

      if (value === pageSize.paperType || !PageSizePreset[value]) return;

      const { widthPx, heightPx } = PageSizePreset[value];
      const isPortrait = pageSize.widthPx < pageSize.heightPx;

      const size = Object.assign(
        { paperType: value },
        isPortrait ? { widthPx, heightPx } : { widthPx: heightPx, heightPx: widthPx },
      );
      dispatch(setSize({ size }));
    },
    [dispatch, pageSize],
  );

  return {
    ...state,
    ...pageSize,
    orientation: pageSize.heightPx > pageSize.widthPx ? Orientation.portrait : Orientation.landscape,
    paperType: getPaperType(pageSize),
    handleOriengtationChange,
    handlePaperTypeChange,
    handleUnitChange,
  };
};

const useSizeInputControl = ({ size, unit, setSize }: InputControlProps): InputControl => {
  const [internalValue, setInternalValue] = useState('');

  const onChange = useCallback(
    (value: string) => {
      // Allow empty input field
      const updateValue = unit === PageSizeUnit.px && value !== '' ? parseInt(value).toString() : value;
      setInternalValue(updateValue);
    },
    [unit, setInternalValue],
  );

  const onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const value = Number(target.value);

      if (!validateSizeInput(value)) {
        setInternalValue(size.toString());
        return;
      }

      const newValue = toPixels(value, unit);
      setSize?.(newValue);
    },
    [size, unit, setSize],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key || e.code;

      if (key === Code.Enter) {
        const target = e.target as HTMLInputElement;
        const value = Number(target.value);

        if (!validateSizeInput(value)) {
          setInternalValue(size.toString());
          return;
        }

        const newValue = toPixels(value, unit);
        setSize?.(newValue);
      }
    },
    [size, unit, setSize],
  );

  useEffect(() => {
    setInternalValue(format(size, unit));
  }, [size, unit]);

  return {
    internalValue,
    onChange,
    onBlur,
    onKeyDown,
  };
};

export { usePageSizeControl, useSizeInputControl };
