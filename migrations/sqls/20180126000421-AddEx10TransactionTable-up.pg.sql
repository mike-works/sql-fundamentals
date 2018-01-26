CREATE TABLE "transaction" (
  id              SERIAL     NOT NULL,
  "authorization" CHAR(255)  NOT NULL,
  orderid         Integer       NOT NULL,
  FOREIGN KEY (orderid) REFERENCES "order"(id),
  PRIMARY KEY ("id")
);