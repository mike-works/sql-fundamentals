-- Put your MySQL "up" migration here
ALTER TABLE Product 
  ADD COLUMN metadata JSON,
  ADD COLUMN tags JSON,
  ADD COLUMN spicy INT GENERATED ALWAYS AS (metadata->>"$.flavor.spicy"),
  ADD COLUMN sweet INT GENERATED ALWAYS AS (metadata->>"$.flavor.sweet"),
  ADD COLUMN salty INT GENERATED ALWAYS AS (metadata->>"$.flavor.salty"),
  ADD COLUMN sour INT GENERATED ALWAYS AS (metadata->>"$.flavor.sour"),
  ADD COLUMN bitter INT GENERATED ALWAYS AS (metadata->>"$.flavor.bitter");
