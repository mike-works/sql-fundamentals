-- Put your SQLite "up" migration here
CREATE INDEX orderdetailproductid ON OrderDetail(productid);
CREATE INDEX orderdetailorderid ON OrderDetail(orderid);
CREATE INDEX ordercustomerid ON CustomerOrder(customerid);
CREATE INDEX orderemployeeid ON CustomerOrder(employeeid);
CREATE INDEX productsupplierid ON Product(supplierid);
CREATE INDEX employeereportsto ON Employee(reportsto);