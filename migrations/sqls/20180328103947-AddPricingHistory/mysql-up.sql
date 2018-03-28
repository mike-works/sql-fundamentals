-- Put your MySQL "up" migration here
CREATE TABLE ProductPricingInfo(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  fromprice REAL,
  toprice REAL NOT NULL,
  changedate DATE NOT NULL,
  productid INTEGER NOT NULL REFERENCES Product(id) ON DELETE CASCADE
);

CREATE TRIGGER ProductPricingUpdate
  AFTER UPDATE ON Product
  FOR EACH ROW
BEGIN
  IF OLD.unitprice != NEW.unitprice THEN
    INSERT INTO ProductPricingInfo(fromprice, toprice, changedate, productid)
      VALUES(OLD.unitprice, NEW.unitprice, NOW(), OLD.id);
  END IF;
END;

CREATE TRIGGER ProductPricingInsert
  AFTER INSERT ON Product
  FOR EACH ROW
BEGIN
  INSERT INTO ProductPricingInfo(toprice, changedate, productid)
    VALUES(NEW.unitprice, NOW(), NEW.id);
END;