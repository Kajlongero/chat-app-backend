export type User = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type Auth = {
  id: number;
  banned: boolean;
  blocked: boolean;
  restricted: boolean;
  user_id: string;
  password_recovery_until: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type AuthInfo = {
  id: number;
  email: string;
  auth_id: number;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type AuthRecovery = {
  id: string;
  code: number;
  auth_id: number;
  attempts: number;
  change_token: string;
  verification_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
};

export type ActiveSession = {
  id: number;
  at_jti: string;
  rt_jti: string;
  active: boolean;
  auth_id: number;
  public_key: string;
  created_at: string;
  expires_at: string;
  last_activity: string;
};
