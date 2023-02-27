import { NumberInput, useBoolean } from '@chakra-ui/react';
import { ComponentProps, KeyboardEvent, useEffect, useState } from 'react';

import { Code } from 'constants/keyboard';
import { NumberInputField } from 'modules/common/components/Input/NumberInputField';

interface PageNumberInputProps {
  currentPageNumber: string | number;
  totalPageCount: number;
  handlePageSwitch: (pageNumber: number) => void;
  label?: string;

  numberInputProps?: ComponentProps<typeof NumberInput>;
}

export const PageNumberInput = ({
  currentPageNumber,
  totalPageCount,
  handlePageSwitch,
  label = 'Find Page',
  numberInputProps,
}: PageNumberInputProps) => {
  // Only empty string '' is allowed for string
  const [pageNumber, setPageNumber] = useState<string | number>(currentPageNumber);
  const [isInvalid, setIsInvalid] = useBoolean(false);

  useEffect(() => {
    setPageNumber(currentPageNumber);
  }, [currentPageNumber]);

  const isFirstPage = currentPageNumber === 1;
  const isLastPage = currentPageNumber === totalPageCount;

  const getValidPageNumber = (pageNumberInput: number, max: number, min: number = 1) => {
    let validPageNumber = pageNumberInput;

    if (pageNumberInput > max) {
      validPageNumber = max;
    } else if (pageNumberInput < min) {
      validPageNumber = min;
    }

    return validPageNumber;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = (e.key || e.code) as Code;

    if (key !== Code.Enter) return;

    handleBlur();
  };

  const handleBlur = () => {
    // If empty string is the value and blurred, reset it with the current page
    if (pageNumber === '') {
      setPageNumber(currentPageNumber);
      return;
    }

    if (typeof pageNumber !== 'number' || !Number.isInteger(pageNumber)) return;

    const validPageNumber = getValidPageNumber(pageNumber, totalPageCount);

    if (isInvalid) {
      setIsInvalid.off();
      setPageNumber(isLastPage ? totalPageCount : validPageNumber);
      return;
    }

    // Switch to the page by manual input
    handlePageSwitch(validPageNumber);
  };

  const handleChange = (_: string, valueAsNumber: number) => {
    // Only empty string is allowed for the string case
    const newPageNumber: number | string = isNaN(valueAsNumber) ? '' : parseInt(`${valueAsNumber}`.substring(0, 2));

    setPageNumber(newPageNumber);
  };

  const handleInvalid = (_message: string, _: string, valueAsNumber: number) => {
    if (isInvalid) return;

    // When number is in invalid range and if,
    // 1. current page is the last page and number input is bigger than total page count, or
    // 2. current page is the first page and number input is smaller than the first page number,
    // No need to dispatch, only update page number state
    if ((isLastPage && valueAsNumber > totalPageCount) || (isFirstPage && valueAsNumber < 1)) {
      setIsInvalid.on();
    }
  };

  return (
    <NumberInput
      value={pageNumber}
      min={1}
      max={totalPageCount}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      w='1.375rem'
      h='1.375rem'
      onInvalid={handleInvalid}
      {...numberInputProps}
    >
      <NumberInputField
        aria-label={label}
        placeholder={`${currentPageNumber}`}
        h='100%'
        padding={0}
        textAlign='center'
        borderRadius={4}
        fontWeight='semibold'
        lineHeight='1.375rem'
      />
    </NumberInput>
  );
};
