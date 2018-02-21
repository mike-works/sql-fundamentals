-- Put your MySQL "up" migration here
CREATE FULLTEXT INDEX product_fts ON Product (productname, quantityperunit);
CREATE FULLTEXT INDEX employee_fts ON Employee (firstname,lastname,title,notes,country);
CREATE FULLTEXT INDEX customer_fts ON Customer (contactname,companyname,country,city);
CREATE FULLTEXT INDEX supplier_fts ON Supplier (contactname,companyname, country,city);
