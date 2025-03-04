-- Register

CREATE OR REPLACE FUNCTION security.register_user (
  p_username VARCHAR,
  p_email VARCHAR,
  p_password VARCHAR 
) RETURNS TABLE (
  user_id UUID,
  auth_id INTEGER,
  profile_id INTEGER,
  role_id INTEGER,
  role_name VARCHAR
) 
AS $$
DECLARE 
  t_user_id UUID;
  t_auth_id INTEGER;
  t_profile_id INTEGER;
  t_auth_info_id INTEGER;
  t_role_id INTEGER;
  t_role_name VARCHAR;
BEGIN    
  INSERT INTO security.users (username)
  VALUES (p_username)
  RETURNING id INTO t_user_id;

  INSERT INTO security.auth (user_id)
  VALUES (t_user_id)
  RETURNING id INTO t_auth_id;

  INSERT INTO security.profile (user_id)
  VALUES (t_user_id)
  RETURNING id INTO t_profile_id;

  INSERT INTO security.auth_info (auth_id, email, password) 
  VALUES (t_auth_id, p_email, p_password)
  RETURNING id INTO t_auth_info_id;

  SELECT rdv.role_id as role_id, rdv.role_name INTO t_role_id, t_role_name
  FROM security.roles_dedicated_view AS rdv
  WHERE rdv.role_name = 'REGULAR_USER';

  INSERT INTO security.auth_roles (role_id, auth_id) VALUES
  (t_role_id, t_auth_id);

  RETURN QUERY SELECT t_user_id, t_auth_id, t_profile_id, t_role_id, t_role_name;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Transaction rolled back due to an error: %', SQLERRM;
    RETURN;
END; 
$$ language plpgsql;

-- Log in

-- Create new Session 

CREATE OR REPLACE FUNCTION security.create_session (
  p_auth_id INTEGER,
  p_jti VARCHAR,
  p_public_key TEXT,
  p_interval INTERVAL
) 
RETURNS TABLE (
  session_id BIGINT
) AS $$ 
DECLARE
  t_time_w_interval TIMESTAMPTZ;
BEGIN
  t_time_w_interval := NOW() + p_interval;

  INSERT INTO security.active_sessions (auth_id, jti, public_key, expires_at)
  VALUES (p_auth_id, p_jti, p_public_key, t_time_w_interval)
  RETURNING id INTO session_id;

  RETURN QUERY SELECT session_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to create session due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

SELECT r.id as id, r.name as name FROM security.roles as r JOIN security.auth_roles as ar ON ar.role_id = r.id JOIN security.auth as a ON a.id = ar.auth_id;