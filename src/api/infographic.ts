import { SAMPLE_INFOGRAPH } from '../utils/loadSampleInfograph';

export const FETCH_INFOGRAPH_ENDPOINT = `/api/infograph`;

export async function save<T>(data: T): Promise<T | undefined> {
  // TODO: print to screen for now
  // This api can be axios.post or react QueryClient
  // console.log('Save infographic', data);
  return;
}

export async function load(id: string): Promise<any> {
  return SAMPLE_INFOGRAPH;
}

const api = {
  save,
  load,
};

export default api;
