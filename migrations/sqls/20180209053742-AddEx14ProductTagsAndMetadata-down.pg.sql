ALTER TABLE Product
DROP COLUMN metadata,
DROP COLUMN tags;

DROP INDEX IF EXISTS product_spicy;
DROP INDEX IF EXISTS product_sweet;
DROP INDEX IF EXISTS product_salty;
DROP INDEX IF EXISTS product_sour;
DROP INDEX IF EXISTS product_bitter;