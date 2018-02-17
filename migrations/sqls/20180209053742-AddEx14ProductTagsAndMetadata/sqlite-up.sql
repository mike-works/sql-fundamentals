-- Put your SQLite "up" migration here
ALTER TABLE Product 
  ADD COLUMN metadata TEXT,
  ADD COLUMN tags TEXT;