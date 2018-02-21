-- Put your MySQL "down" migration here
DROP INDEX product_fts ON Product;
DROP INDEX employee_fts ON Employee;
DROP INDEX customer_fts ON Customer;
DROP INDEX supplier_fts ON Supplier;