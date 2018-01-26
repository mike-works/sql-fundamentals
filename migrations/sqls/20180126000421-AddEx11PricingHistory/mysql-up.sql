-- Put your MySQL "up" migration here
CREATE TABLE ProductPricingInfo (
  id                INTEGER PRIMARY KEY AUTO_INCREMENT,
  fromprice         REAL,
  toprice           REAL  NOT NULL,
  changedate        TEXT  NOT NULL,
  productid         INTEGER       NOT NULL,
  FOREIGN KEY (productid) REFERENCES Product(id) ON DELETE CASCADE
);

CREATE TRIGGER ProductPricingUpdate
    AFTER UPDATE ON Product
    FOR EACH ROW
BEGIN
    IF OLD.unitprice != NEW.unitprice THEN
        INSERT INTO ProductPricingInfo (fromprice, toprice, changedate, productid) VALUES (old.unitprice, new.unitprice, NOW(), new.id);
    END IF;
END;

CREATE TRIGGER ProductPricingInsert
    AFTER INSERT ON Product
    FOR EACH ROW
BEGIN
    INSERT INTO ProductPricingInfo (fromprice, toprice, changedate, productid) VALUES (null, new.unitprice, NOW(), new.id);
END;
