CREATE MATERIALIZED VIEW IF NOT EXISTS security.roles_dedicated_view 
AS
  SELECT 
    r.id as role_id,
    r.name as role_name,
    rc.name as role_category
  FROM 
    security.roles as r
  JOIN 
    security.roles_categories_roles as rcr 
  ON
    rcr.role_id = r.id
  JOIN
    security.roles_categories as rc
  ON
    rc.id = rcr.roles_categories_id
  ORDER BY r.id ASC
  WITH DATA; 
