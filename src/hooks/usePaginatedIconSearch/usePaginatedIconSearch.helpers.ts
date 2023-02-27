import { IconColorOption } from 'types/icon.types';
import { iconIndex } from 'api/algolia';
import { IconHit, SearchApiResponse } from './usePaginatedIconSearch.types';
import { restrictSearchableAttributes } from './usePaginatedIconSearch.config';

const DEFAULT_HITS_PER_PAGE = 36;

export const fetchIcons = (key: string) => {
  const [query, page, style] = key.split('_');

  const attributeStyle = style === IconColorOption.All ? 'attr_style:' : `attr_style: ${style}`;
  const facetFilters = [attributeStyle, 'published:-0'];
  const hitsPerPage = DEFAULT_HITS_PER_PAGE;

  return iconIndex
    .search(query, { hitsPerPage, facetFilters, restrictSearchableAttributes, page: +page })
    .then((content) => content);
};

const oldIconRegex = /^(fa3-icon|rjs[1-2]|vg-icon).*/;
const filterOutOldIcons = (icon: IconHit) => !oldIconRegex.test(icon.id);
const flattenHits = (d: SearchApiResponse) => d.hits;

export const parseIcons = (data: SearchApiResponse[]) => {
  if (!data) return [];

  return data.filter(Boolean).flatMap(flattenHits).filter(filterOutOldIcons);
};

/**
 * Fetches icons in a specific pack with pagination
 *
 * @param key string of form <PACK_ID>_<PAGE_NUMBER>
 * @returns
 */
export const fetchIconsByPack = (key: string) => {
  const [packId, page] = key.split('_');
  const facetFilters = ['published:-0', `iconPacks:${packId}`];
  const hitsPerPage = DEFAULT_HITS_PER_PAGE;

  return iconIndex
    .search('', { hitsPerPage, facetFilters, restrictSearchableAttributes, page: +page })
    .then((content) => content);
};

/**
 * Check if the "All" icon style is included in the icon style options array
 *
 * @param iconColorOptions IconColorOption[]
 */
export const hasAllIconOption = (iconColorOptions: IconColorOption[]): boolean =>
  iconColorOptions.includes(IconColorOption.All);
