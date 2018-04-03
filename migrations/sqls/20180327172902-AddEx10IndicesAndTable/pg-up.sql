-- Put your PostgreSQL "up" migration here
CREATE UNIQUE INDEX orderdetailuniqueproduct ON OrderDetail(orderid, productid);

CREATE TABLE CustomerOrderTransaction(
  id SERIAL PRIMARY KEY,
  auth VARCHAR(255) NOT NULL,
  orderid INTEGER REFERENCES CustomerOrder(id)
);