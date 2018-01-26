-- Put your SQLite "up" migration here
CREATE TABLE CustomerOrderTransaction (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  auth            CHAR(255)  NOT NULL,
  orderid         Integer       NOT NULL,
  FOREIGN KEY (orderid) REFERENCES CustomerOrder(id)
);
