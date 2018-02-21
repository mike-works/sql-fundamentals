-- Put your PostgreSQL "down" migration here
DROP INDEX product_fts;
DROP INDEX employee_fts;
DROP INDEX customer_fts;
DROP INDEX supplier_fts;