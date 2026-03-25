ALTER TABLE trips ADD COLUMN IF NOT EXISTS story_summary TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS points_of_interest JSONB;
ALTER TABLE uploaded_pictures ADD COLUMN IF NOT EXISTS punchy_description TEXT;
ALTER TABLE uploaded_pictures ADD COLUMN IF NOT EXISTS story_segment TEXT;
