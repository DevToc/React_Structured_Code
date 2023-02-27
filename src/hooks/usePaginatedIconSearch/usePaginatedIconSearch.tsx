import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { RequestOptions } from '@algolia/transporter';

import { IconColorOption } from 'types/icon.types';
import {
  SearchApiResponse,
  PaginatedIconSearch,
  IconHit,
  PaginatedIconSearchOptions,
} from './usePaginatedIconSearch.types';
import { emptyQuery } from './usePaginatedIconSearch.config';
import { fetchIcons, parseIcons, fetchIconsByPack, hasAllIconOption } from './usePaginatedIconSearch.helpers';

/**
 *  Hook that returns Algolia icon search functionality.
 *  Comes with retries and caching and pagination.
 *  The hook returns:
 *      - Functions for searching icons
 *      - The search state (e.g. loading, error)
 *      - The icon search result
 * @returns {PaginatedIconSearch}
 */
export const usePaginatedIconSearch = (options?: PaginatedIconSearchOptions): PaginatedIconSearch => {
  const { filterByIconPack, colorOptions = [IconColorOption.All, IconColorOption.Color, IconColorOption.Mono] } =
    options || {};

  const [query, setQuery] = useState<string>('');
  const [selectedColorOption, setSelectedColorOption] = useState<IconColorOption>(
    // if "all" icon styles are included in the color options it should be selected as the style
    hasAllIconOption(colorOptions) ? IconColorOption.All : colorOptions[0],
  );

  // cache key for icon search query result per page and selectedColorOption
  const getKey = (page: number) => `${query}_${page}_${selectedColorOption}`;

  const swrConfig = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // skip fetch if there is no query
    fallbackData: query ? undefined : [emptyQuery],
  };

  const fetchFn = filterByIconPack ? fetchIconsByPack : fetchIcons;

  const {
    data: initialData,
    error,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<RequestOptions>(getKey, fetchFn, swrConfig);
  const data = initialData as SearchApiResponse[];

  const searchIcons = (search: string) => {
    if (hasAllIconOption(colorOptions)) setSelectedColorOption(IconColorOption.All);
    setQuery(search);
  };

  const clearSearch = () => {
    if (!query) return;

    if (hasAllIconOption(colorOptions)) setSelectedColorOption(IconColorOption.All);
    setQuery('');
    setPage(1);
  };

  const onShowMore = () => setPage(page + 1);
  const icons: IconHit[] = parseIcons(data);

  const hasMore = data && data.length ? data[data.length - 1]?.nbPages - 1 > data[data.length - 1]?.page : false;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = !!(isLoadingInitialData || (page > 0 && data && typeof data[page - 1] === 'undefined'));
  const hasNoResultsFound = !!(icons.length === 0 && !isLoadingInitialData && query);

  // if the icon style is not included in the color options, set the icon style to the first color option
  if (!colorOptions.includes(selectedColorOption) && colorOptions.length) setSelectedColorOption(colorOptions[0]);

  return {
    error,
    hasMore,
    isLoadingMore,
    isLoadingInitialData,
    colorOptions,
    selectedColorOption,
    setSelectedColorOption,
    query,
    icons,
    onShowMore,
    clearSearch,
    searchIcons,
    hasNoResultsFound,
  };
};
