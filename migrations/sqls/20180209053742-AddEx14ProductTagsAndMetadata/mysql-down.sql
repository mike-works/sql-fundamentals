-- Put your MySQL "down" migration here
ALTER TABLE Product
DROP COLUMN tags,
DROP COLUMN spicy,
DROP COLUMN sweet,
DROP COLUMN salty,
DROP COLUMN sour,
DROP COLUMN bitter;

ALTER TABLE Product
DROP COLUMN metadata;