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
  p_interval INTERVAL,
  p_public_key TEXT
) 
RETURNS TABLE (LIKE security.active_sessions) 
AS $$ 
DECLARE
  t_session_id BIGINT;
  t_time_w_interval TIMESTAMPTZ;
BEGIN
  t_time_w_interval := NOW() + p_interval;

  INSERT INTO security.active_sessions (auth_id, public_key, expires_at)
  VALUES (p_auth_id, p_public_key, t_time_w_interval)
  RETURNING id INTO t_session_id;

  RETURN QUERY SELECT * FROM security.active_sessions WHERE id = t_session_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to create session due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security.create_recovery_password_record (
  p_auth_id INTEGER,
  p_code INTEGER,
  p_change_token VARCHAR,
  p_verification_token VARCHAR
) RETURNS TABLE 
  (LIKE security.auth_recovery)
AS $$ 
DECLARE 
  t_id UUID;
BEGIN
  t_time_w_interval := NOW() + '30 min';

  INSERT INTO security.auth_recovery(auth_id, code, change_token, verification_token)
  VALUES (p_auth_id, p_code, p_change_token, p_verification_token)
  RETURNING id INTO t_id;

  RETURN QUERY SELECT * FROM security.auth_recovery WHERE id = t_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to create the recovery email record due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security.change_password_by_recovery (
  p_auth_id INTEGER,
  p_password VARCHAR
) RETURNS TABLE (LIKE security.auth_info) 
AS $$
BEGIN
  UPDATE security.auth_info SET password = p_password
  WHERE auth_id = p_auth_id;

  UPDATE security.auth SET password_recovery_until = null 
  WHERE id = p_auth_id;

  DELETE FROM security.auth_recovery WHERE auth_id = p_auth_id;
  DELETE FROM security.active_sessions WHERE auth_id = p_auth_id;

  RETURN QUERY SELECT * FROM security.auth_info WHERE auth_id = p_auth_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to change password and delete changes due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;