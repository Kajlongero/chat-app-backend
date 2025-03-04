INSERT INTO security.roles_categories (name) VALUES
  ('ADMIN'),
  ('GROUP'),
  ('SECURITY'),
  ('MODERATOR'),
  ('ANALYST'),
  ('USER');

INSERT INTO security.roles (name) VALUES
  ('SUPER_ADMIN'),
  ('ADMIN'),
  ('GROUP_ADMIN'),
  ('GROUP_MODERATOR'),
  ('GROUP_OWNER'),
  ('SECURITY_ADMIN'),
  ('SECURITY_AUDITOR'),
  ('CONTENT_MODERATOR'),
  ('USER_MODERATOR'),
  ('DATA_ANALYST'),
  ('BUSINESS_ANALYST'),
  ('REGULAR_USER'),
  ('PREMIUM_USER'),
  ('OWNER');

INSERT INTO security.roles_categories_roles (role_id, roles_categories_id) VALUES
-- ADMIN
((SELECT id FROM security.roles WHERE name = 'SUPER_ADMIN'), (SELECT id FROM security.roles_categories WHERE name = 'ADMIN')),
((SELECT id FROM security.roles WHERE name = 'ADMIN'), (SELECT id FROM security.roles_categories WHERE name = 'ADMIN')),
((SELECT id FROM security.roles WHERE name = 'OWNER'), (SELECT id FROM security.roles_categories WHERE name = 'ADMIN')),

-- GROUP
((SELECT id FROM security.roles WHERE name = 'GROUP_ADMIN'), (SELECT id FROM security.roles_categories WHERE name = 'GROUP')),
((SELECT id FROM security.roles WHERE name = 'GROUP_MODERATOR'), (SELECT id FROM security.roles_categories WHERE name = 'GROUP')),
((SELECT id FROM security.roles WHERE name = 'GROUP_OWNER'), (SELECT id FROM security.roles_categories WHERE name = 'GROUP')),

-- SECURITY
((SELECT id FROM security.roles WHERE name = 'SECURITY_ADMIN'), (SELECT id FROM security.roles_categories WHERE name = 'SECURITY')),
((SELECT id FROM security.roles WHERE name = 'SECURITY_AUDITOR'), (SELECT id FROM security.roles_categories WHERE name = 'SECURITY')),

-- MODERATOR
((SELECT id FROM security.roles WHERE name = 'CONTENT_MODERATOR'), (SELECT id FROM security.roles_categories WHERE name = 'MODERATOR')),
((SELECT id FROM security.roles WHERE name = 'USER_MODERATOR'), (SELECT id FROM security.roles_categories WHERE name = 'MODERATOR')),

-- ANALYST
((SELECT id FROM security.roles WHERE name = 'DATA_ANALYST'), (SELECT id FROM security.roles_categories WHERE name = 'ANALYST')),
((SELECT id FROM security.roles WHERE name = 'BUSINESS_ANALYST'), (SELECT id FROM security.roles_categories WHERE name = 'ANALYST')),

-- USER
((SELECT id FROM security.roles WHERE name = 'REGULAR_USER'), (SELECT id FROM security.roles_categories WHERE name = 'USER')),
((SELECT id FROM security.roles WHERE name = 'PREMIUM_USER'), (SELECT id FROM security.roles_categories WHERE name = 'USER'));