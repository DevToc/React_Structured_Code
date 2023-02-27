import { IconColorOption } from 'types/icon.types';

export interface IconHit {
  attr_style: string;
  category: string;
  iconPack: string;
  id: string;
  illustration: number;
  name: string;
  objectID: string;
  type: string;
}

export interface SearchApiResponse {
  hits: IconHit[];
  nbPages: number;
  page: number;
  hitsPerPage: number;
  nbHits: number;
  exhaustiveTypo: number;
  exhaustiveNbHits: number;
  params: string;
  processingTimeMS: number;
  query: string;
}

export interface PaginatedIconSearch {
  error: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadingInitialData: boolean;
  colorOptions: IconColorOption[];
  selectedColorOption: IconColorOption;
  hasNoResultsFound: boolean;
  query: string;
  icons: IconHit[];
  setSelectedColorOption: (colorOption: IconColorOption) => void;
  onShowMore: () => void;
  clearSearch: () => void;
  searchIcons: (query: string) => void;
}

export type PaginatedIconSearchOptions = {
  filterByIconPack?: boolean;
  colorOptions?: IconColorOption[];
};
