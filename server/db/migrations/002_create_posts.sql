CREATE TABLE IF NOT EXISTS posts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_urls       TEXT[]      NOT NULL DEFAULT '{}',
  caption_ai       TEXT,
  caption_user     TEXT,
  location_name    VARCHAR(255),
  lat              FLOAT,
  lng              FLOAT,
  date_taken       DATE,
  weather_summary  VARCHAR(100),
  temperature      FLOAT,
  created_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);
