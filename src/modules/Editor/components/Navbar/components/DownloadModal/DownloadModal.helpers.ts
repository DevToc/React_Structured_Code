// Check if `pageNumber` is a valid number
const isValidPageNumber = (pageNumber: number) => !Number.isNaN(pageNumber);

// Check if `pageNumber` is within the valid range 0 < pageNumber <= maxPageLimit
const isWithinValidRange = (pageNumber: number, maxPageLimit: number) => {
  return pageNumber > 0 && Math.floor(pageNumber) === pageNumber && pageNumber <= maxPageLimit;
};

// Check if `value` includes "-"
const isSequence = (value: string) => value.includes('-');

/**
 * Check if each page number is a valid number
 * and within the valid range which is greater than 0 and less than or equal to max page limit
 * and the first number is greater than the second number e.g., 4-2 (X) 1-3 (O)
 * If the validity check fails, throw the error
 *
 * @param pageSection
 * @param maxPageLimit
 * @param isSequence
 * @returns
 */
const validatePageSection = (pageSection: string, maxPageLimit: number, isSequence?: boolean) => {
  let shouldThrow = false;
  let errMsg = '';

  if (isSequence) {
    const pageRange = pageSection.split('-').map((p) => Number(p));
    shouldThrow =
      pageRange.length !== 2 ||
      pageRange.some((p) => !isValidPageNumber(p) || !isWithinValidRange(p, maxPageLimit)) ||
      pageRange[0] > pageRange[1];

    if (shouldThrow) errMsg = 'Invalid Page Range';
  } else {
    const pageNumber = Number(pageSection);
    shouldThrow = !isValidPageNumber(pageNumber) || !isWithinValidRange(pageNumber, maxPageLimit);

    if (shouldThrow) errMsg = 'Invalid Number';
  }

  if (shouldThrow) {
    throw new Error(`Malformed page option: ${errMsg}`);
  }

  return true;
};

/**
 * Parse the custom page range input into
 * array of page numbers with the validity check
 *
 * @param input
 * @param maxPageLimit
 * @returns array of page numbers
 */
export const parseCustomPageRangeInput = (input: string, maxPageLimit: number) => {
  const parsed: string[] = input.trim().split(/\s*(?:,)\s*/);
  const selectedPages = parsed.reduce((pageRanges: number[], section: string) => {
    if (isSequence(section) && validatePageSection(section, maxPageLimit, true)) {
      // Handle the case with sequential numbers e.g., 1-3,5-7
      const pageRange = section.split('-').map((p) => Number(p));
      const pageNumbersInRange = Array.from({ length: pageRange[1] - pageRange[0] + 1 }, (_, i) => i + pageRange[0]);
      pageRanges = pageRanges.concat(pageNumbersInRange);
    } else if (validatePageSection(section, maxPageLimit)) {
      // Handle the case with respective number e.g., 1,3,7
      pageRanges.push(Number(section));
    }

    return pageRanges;
  }, []);

  // Sort and get rid of duplicate page number
  return [...new Set(selectedPages)].sort();
};
