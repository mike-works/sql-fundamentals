-- Put your PostgreSQL "down" migration here
ALTER TABLE Product
DROP COLUMN metadata,
DROP COLUMN tags;