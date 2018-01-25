-- Put your MySQL "down" migration here
-- Order Indices: Customer, Employee
DROP INDEX OrderCustomerId ON CustomerOrder;
DROP INDEX OrderEmployeeId ON CustomerOrder;
-- Order Detail Indices: Order, Product
DROP INDEX OrderDetailOrderId ON OrderDetail;
DROP INDEX OrderDetailProductId ON OrderDetail;
-- Product Indices: Suppliers
DROP INDEX ProductSupplierId ON Product;
-- Employee Indices: ReportsTo
DROP INDEX EmployeeReportsTo ON Employee;