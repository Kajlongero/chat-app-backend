CREATE TABLE IF NOT EXISTS languages (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  iso_code CHAR(2) UNIQUE,
  region_code VARCHAR(5),
  native_name VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT(now()),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_languages_name ON languages(name);
CREATE INDEX idx_languages_iso_code ON languages(region_code);