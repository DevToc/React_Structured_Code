import algoliasearch from 'algoliasearch';

const CLIENT_APP_ID = process.env.REACT_APP_ALGOLIA_CLIENT_APP_ID as string;
const PUBLIC_API_KEY = process.env.REACT_APP_ALGOLIA_PUBLIC_API_KEY as string;

const searchClient = algoliasearch(CLIENT_APP_ID, PUBLIC_API_KEY);

enum AlgoliaIndex {
  Icon = 'Icons v16',
}

export const iconIndex = searchClient.initIndex(AlgoliaIndex.Icon);
