-- Put your MySQL "down" migration here
ALTER TABLE Product
  DROP COLUMN tags,
  DROP COLUMN spicy,
  DROP COLUMN sweet,
  DROP COLUMN sour,
  DROP COLUMN salty,
  DROP COLUMN bitter;

ALTER TABLE Product
  DROP COLUMN metadata;