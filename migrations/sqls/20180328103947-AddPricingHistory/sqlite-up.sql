-- Put your SQLite "up" migration here
CREATE TABLE ProductPricingInfo(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fromprice REAL,
  toprice REAL NOT NULL,
  changedate DATE NOT NULL,
  productid INTEGER NOT NULL REFERENCES Product(id) ON DELETE CASCADE
);


CREATE TRIGGER ProductPricingUpdate
  AFTER UPDATE ON Product
  FOR EACH ROW
BEGIN
  INSERT INTO ProductPricingInfo(fromprice, toprice, changedate, productid)
    VALUES(OLD.unitprice, NEW.unitprice, datetime('now'), OLD.id);
END;

CREATE TRIGGER ProductPricingInsert
  AFTER INSERT ON Product
  FOR EACH ROW
BEGIN
  INSERT INTO ProductPricingInfo(toprice, changedate, productid)
    VALUES(NEW.unitprice, datetime('now'), NEW.id);
END;