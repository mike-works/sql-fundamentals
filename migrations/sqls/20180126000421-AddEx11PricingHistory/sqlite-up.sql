-- Put your SQLite "up" migration here
CREATE TABLE ProductPricingInfo (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  fromprice         REAL,
  toprice           REAL  NOT NULL,
  changedate        TEXT  NOT NULL,
  productid         INTEGER       NOT NULL,
  FOREIGN KEY (productid) REFERENCES Product(id) ON DELETE CASCADE
);

CREATE TRIGGER ProductPricingUpdate
AFTER UPDATE ON Product
FOR EACH ROW
WHEN old.unitprice != new.unitprice
BEGIN
    INSERT INTO ProductPricingInfo (fromprice, toprice, changedate, productid) VALUES (old.unitprice, new.unitprice, datetime('now'), new.id);
END;

CREATE TRIGGER ProductPricingInsert
AFTER INSERT ON Product
FOR EACH ROW
BEGIN
    INSERT INTO ProductPricingInfo (fromprice, toprice, changedate, productid) VALUES (null, new.unitprice, datetime('now'), new.id);
END;