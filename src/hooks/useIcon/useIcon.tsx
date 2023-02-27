import useSWRImmutable from 'swr/immutable';

const BASE_ICON_V1_URL = 'https://s3.amazonaws.com/media.venngage.com/icons/v1/';
const fetcher = (iconId: string) => fetch(`${BASE_ICON_V1_URL}${iconId}.json?`).then((res) => res.json());

export interface IconApiResponse {
  svg: string;
  color: number;
  viewBox?: string;
  description?: string;
  premium?: boolean;
  author?: string;
  old_icon?: number;
}

export const useIcon = (iconId: string): { data: IconApiResponse | undefined; error: Error } => {
  const { data, error } = useSWRImmutable<IconApiResponse>(iconId, fetcher);

  return { data, error };
};
