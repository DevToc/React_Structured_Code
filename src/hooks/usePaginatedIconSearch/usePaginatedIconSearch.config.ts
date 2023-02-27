// Restrict searchable English attributes
export const restrictSearchableAttributes = ['_primaryTags_en', '_tags_en', 'name', 'category', 'objectID'];

export const emptyQuery = {
  hits: [],
  nbPages: 0,
  page: 0,
  hitsPerPage: 0,
  nbHits: 0,
  exhaustiveTypo: 0,
  exhaustiveNbHits: 0,
  params: '',
  processingTimeMS: 0,
  query: '',
};
