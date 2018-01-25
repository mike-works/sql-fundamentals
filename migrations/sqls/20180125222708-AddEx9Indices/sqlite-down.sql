-- Put your SQLite "down" migration here
-- Order Indices: Customer, Employee
DROP INDEX OrderCustomerId;
DROP INDEX OrderEmployeeId;
-- Order Detail Indices: Order, Product
DROP INDEX OrderDetailOrderId;
DROP INDEX OrderDetailProductId;
-- Product Indices: Suppliers
DROP INDEX ProductSupplierId;
-- Employee Indices: ReportsTo
DROP INDEX EmployeeReportsTo;
