export type RegisterResponse = {
  user_id: string;
  auth_id: number;
  profile_id: number;
  role_id: number;
  role_name: string;
};

export type CredentialsAuthResponse = {
  sessionId: string | number;
  privateKey: string;
  accessToken: string;
  refreshToken: string;
};
