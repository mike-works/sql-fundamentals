-- Put your MySQL "up" migration here
CREATE UNIQUE INDEX orderdetailuniqueproduct ON OrderDetail(orderid, productid);

CREATE TABLE CustomerOrderTransaction(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  auth VARCHAR(255) NOT NULL,
  orderid INTEGER REFERENCES CustomerOrder(id)
);