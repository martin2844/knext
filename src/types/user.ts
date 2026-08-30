export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type OAuthUser = User & {
  provider: string;
  providerAccountId: string;
};

export type PersistedUser = User & {
  provider: string | null;
  provider_account_id: string | null;
};
