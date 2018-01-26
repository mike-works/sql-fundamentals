-- Put your PostgreSQL "up" migration here
CREATE TABLE CustomerOrderTransaction (
  id              SERIAL PRIMARY KEY  NOT NULL,
  auth            CHAR(255)  NOT NULL,
  orderid         Integer       NOT NULL,
  FOREIGN KEY (orderid) REFERENCES CustomerOrder(id)
);
