-- Put your PostgreSQL "down" migration here
DROP INDEX product_fts;
ALTER TABLE Product DROP COLUMN fts;

DROP INDEX supplier_fts;
ALTER TABLE Supplier DROP COLUMN fts;

DROP INDEX customer_fts;
ALTER TABLE Customer DROP COLUMN fts;

-- ALTER TABLE Category DROP COLUMN fts;
-- DROP INDEX category_fts;

DROP INDEX employee_fts;
ALTER TABLE Employee DROP COLUMN fts;