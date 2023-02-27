import useSWRImmutable from 'swr';

const USER_INFO_API = '/api/user';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface UserState {
  user_id: string;
  user_type: UserType;
  team_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  use_intercom: boolean;
}

export const UserTypes = {
  Free: 'default',
  Premium: 'premium',
  Business: 'business',
  Education: 'education',
  Enterprise: 'enterprise',
} as const;

type UserType = typeof UserTypes[keyof typeof UserTypes];

export const useUser = (): { data: UserState | undefined; error: Error } => {
  const { data, error } = useSWRImmutable<UserState>(USER_INFO_API, fetcher);

  return { data, error };
};
