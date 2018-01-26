CREATE TABLE "transaction" (
  id              SERIAL     PRIMARY KEY,
  "authorization" CHAR(255)  NOT NULL,
  orderid         Integer       NOT NULL,
  FOREIGN KEY (orderid) REFERENCES "order"(id)
);