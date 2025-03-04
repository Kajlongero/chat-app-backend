CREATE MATERIALIZED VIEW IF NOT EXISTS commons.phone_regions_view
  AS
    SELECT 
      r.id as region_id,
      c.name as country_name, 
      r.code as region_code
    FROM
      commons.phone_regions as r
    JOIN 
      commons.countries as c
    ON 
      c.id = r.country_id
  WITH DATA;