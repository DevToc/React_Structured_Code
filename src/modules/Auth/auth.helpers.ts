export const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const removeQueryParamFromUrl = (param: string) => {
  const params = new URLSearchParams(window.location.search);
  params.delete(param);
  window.history.replaceState(null, '', '?' + params + window.location.hash);
};
