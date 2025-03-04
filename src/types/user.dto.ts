export type User = {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type Auth = {};

export type AuthInfo = {
  id: number;
  email: string;
  auth_id: number;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
