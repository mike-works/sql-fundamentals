-- Put your MySQL "up" migration here
-- Order Indices: Customer, Employee
ALTER TABLE CustomerOrder
    ADD INDEX OrderCustomerId (CustomerId);
    -- ADD INDEX OrderEmployeeId (EmployeeId);

-- Order Detail Indices: Order, Product
ALTER TABLE OrderDetail
    ADD INDEX OrderDetailOrderId (OrderId),
    ADD INDEX OrderDetailProductId (ProductId);

-- Product Indices: Suppliers
ALTER TABLE Product
    ADD INDEX ProductSupplierId (SupplierId);
-- Employee Indices: ReportsTo
ALTER TABLE Employee
    ADD INDEX EmployeeReportsTo (ReportsTo);
