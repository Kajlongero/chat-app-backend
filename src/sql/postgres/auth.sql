CREATE TABLE IF NOT EXISTS security.users (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(64) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_username ON security.users(username);

CREATE TABLE IF NOT EXISTS security.phone_numbers (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  region_id INTEGER NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_phone_numbers_user_id
    FOREIGN KEY (user_id)
    REFERENCES security.users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_phone_numbers_region_id 
    FOREIGN KEY (region_id) 
    REFERENCES commons.regions(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE INDEX idx_phone_numbers_user_id ON security.phone_numbers(user_id);
CREATE INDEX idx_phone_numbers_region_id ON security.phone_numbers(region_id);

CREATE TABLE IF NOT EXISTS security.profile (
  id SERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(32),
  last_name VARCHAR(32),
  birth_date DATE,
  description VARCHAR(192),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_profile_user_id 
    FOREIGN KEY (user_id)
    REFERENCES security.users(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE INDEX idx_profile_user_id ON security.profile(user_id);

CREATE TABLE IF NOT EXISTS security.roles (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_role_name ON security.roles(name);

CREATE TABLE IF NOT EXISTS security.roles_categories (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_roles_categories_name ON security.roles_categories(name);

CREATE TABLE IF NOT EXISTS security.roles_categories_roles (
  role_id INTEGER,
  roles_categories_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_roles_categories_roles_role_id 
    FOREIGN KEY (role_id)
    REFERENCES security.roles(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  CONSTRAINT fk_roles_categories_roles_role_categories_id
    FOREIGN KEY (roles_categories_id)
    REFERENCES security.roles_categories(id)
    ON UPDATE CASCADE 
    ON DELETE SET NULL
);

CREATE INDEX idx_roles_categories_roles_role_id ON security.roles_categories_roles(role_id);
CREATE INDEX idx_roles_categories_roles_categories_id ON security.roles_categories_roles(roles_categories_id);

CREATE TABLE IF NOT EXISTS security.auth (
  id SERIAL NOT NULL PRIMARY KEY,
  banned BOOLEAN NOT NULL DEFAULT false,
  blocked BOOLEAN NOT NULL DEFAULT false,
  restricted BOOLEAN NOT NULL DEFAULT false,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_auth_user_id 
    FOREIGN KEY (user_id)
    REFERENCES security.users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX idx_auth_user_id ON security.auth(user_id);

CREATE TABLE IF NOT EXISTS security.auth_roles (
  role_id INTEGER,
  auth_id INTEGER,
  CONSTRAINT fk_auth_roles_role_id 
    FOREIGN KEY (role_id)
    REFERENCES security.roles(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_auth_roles_auth_id
    FOREIGN KEY (auth_id)
    REFERENCES security.auth(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX idx_auth_roles_role_id ON security.auth_roles(role_id);
CREATE INDEX idx_auth_roles_auth_id ON security.auth_roles(auth_id);

CREATE TABLE IF NOT EXISTS security.active_sessions (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  at_jti VARCHAR NOT NULL DEFAULT uuid_generate_v4(),
  rt_jti VARCHAR NOT NULL DEFAULT uuid_generate_v4(),
  auth_id INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  public_key TEXT,
  CONSTRAINT fk_active_session_auth
    FOREIGN KEY (auth_id)
    REFERENCES security.auth(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE INDEX idx_active_sessions_auth_id ON security.active_sessions(auth_id);
CREATE INDEX idx_active_sessions_at_jti ON security.active_sessions(at_jti);
CREATE INDEX idx_active_sessions_rt_jti ON security.active_sessions(rt_jti);

CREATE TABLE IF NOT EXISTS security.auth_info (
  id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  auth_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_auth_info_auth_id 
    FOREIGN KEY (auth_id) 
    REFERENCES security.auth (id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE INDEX idx_auth_info_email ON security.auth_info(email);
CREATE INDEX idx_auth_info_auth_id ON security.auth_info(auth_id);

CREATE TABLE IF NOT EXISTS security.permissions (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(192) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_permissions_name ON security.permissions(name);

CREATE TABLE IF NOT EXISTS security.roles_permissions (
  role_id INTEGER,
  permission_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_roles_permissions_role_id 
    FOREIGN KEY (role_id)
    REFERENCES security.roles(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  CONSTRAINT fk_roles_permissions_permission_id 
    FOREIGN KEY (permission_id)
    REFERENCES security.permissions(id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE INDEX idx_roles_permissions_role_id ON security.roles_permissions(role_id);
CREATE INDEX idx_roles_permissions_permission_id ON security.roles_permissions(permission_id);