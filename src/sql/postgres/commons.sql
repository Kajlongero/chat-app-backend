CREATE TABLE IF NOT EXISTS commons.languages (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  iso_code CHAR(2) UNIQUE,
  region_code VARCHAR(5),
  native_name VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT(now()),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_languages_name ON commons.languages(name);
CREATE INDEX idx_languages_iso_code ON commons.languages(region_code);

CREATE TABLE IF NOT EXISTS commons.countries (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL
);

CREATE INDEX idx_countries_name ON commons.countries(name);

CREATE TABLE IF NOT EXISTS commons.phone_regions (
  id SERIAL NOT NULL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  country_id INTEGER,
  CONSTRAINT fk_regions_country_id 
    FOREIGN KEY (country_id)
    REFERENCES commons.countries(id)
);

CREATE INDEX idx_phone_regions_code ON commons.phone_regions(code);
CREATE INDEX idx_phone_regions_country_id ON commons.phone_regions(country_id);
