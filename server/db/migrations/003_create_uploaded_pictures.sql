CREATE TABLE IF NOT EXISTS uploaded_pictures (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  date_taken TIMESTAMP,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
