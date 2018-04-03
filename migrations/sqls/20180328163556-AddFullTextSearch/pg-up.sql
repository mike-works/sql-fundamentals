-- Put your PostgreSQL "up" migration here
ALTER TABLE Product ADD COLUMN fts tsvector;
UPDATE Product SET fts = to_tsvector('english', productname);
CREATE INDEX product_fts on Product USING GIN (fts);

ALTER TABLE Supplier ADD COLUMN fts tsvector;
UPDATE Supplier SET fts = to_tsvector('english', companyname || ' ' || contactname || ' ' || country || ' ' || city);
CREATE INDEX supplier_fts on Supplier USING GIN (fts);

ALTER TABLE Customer ADD COLUMN fts tsvector;
UPDATE Customer SET fts = to_tsvector('english', companyname || ' ' || contactname || country || ' ' || city);
CREATE INDEX customer_fts on Customer USING GIN (fts);

-- ALTER TABLE Category ADD COLUMN fts tsvector;
-- UPDATE Category SET fts = to_tsvector('english', categoryname);
-- CREATE INDEX category_fts on Category USING GIN (fts);

ALTER TABLE Employee ADD COLUMN fts tsvector;
UPDATE Employee SET fts = to_tsvector('english', firstname || ' ' || lastname || ' ' || notes);
CREATE INDEX employee_fts on Employee USING GIN (fts);