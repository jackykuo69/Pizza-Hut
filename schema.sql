CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  group_name TEXT,
  store_name TEXT,
  district_type TEXT,
  district_subtype TEXT,
  current_stage INTEGER,
  stage_status TEXT,
  data TEXT,
  updated_at TEXT
);
