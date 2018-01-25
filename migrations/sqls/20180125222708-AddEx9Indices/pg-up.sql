-- Put your PostgreSQL "up" migration here
-- Order Indices: Customer, Employee
CREATE INDEX OrderCustomerId ON CustomerOrder(CustomerId);
CREATE INDEX OrderEmployeeId ON CustomerOrder(EmployeeId);
-- Order Detail Indices: Order, Product
CREATE INDEX OrderDetailOrderId ON OrderDetail (OrderId);
CREATE INDEX OrderDetailProductId ON OrderDetail (ProductId);
-- Product Indices: Suppliers
CREATE INDEX ProductSupplierId ON Product (SupplierId);
-- Employee Indices: ReportsTo
CREATE INDEX EmployeeReportsTo ON Employee(ReportsTo);
