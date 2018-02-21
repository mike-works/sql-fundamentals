-- Put your PostgreSQL "up" migration here
CREATE INDEX product_fts ON Product USING GIN (to_tsvector('english', productname || ' ' || quantityperunit));
CREATE INDEX employee_fts ON Employee USING GIN (to_tsvector('english', firstname || ' ' || lastname || ' ' || title || ' ' || notes));
CREATE INDEX customer_fts ON Customer USING GIN (to_tsvector('english', contactname || ' ' || companyname));
CREATE INDEX supplier_fts ON Supplier USING GIN (to_tsvector('english', contactname || ' ' || companyname));
