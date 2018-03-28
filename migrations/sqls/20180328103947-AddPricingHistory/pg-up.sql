-- Put your PostgreSQL "up" migration here
CREATE TABLE ProductPricingInfo(
  id SERIAL PRIMARY KEY,
  fromprice REAL,
  toprice REAL NOT NULL,
  changedate DATE NOT NULL,
  productid INTEGER NOT NULL REFERENCES Product(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION pricing_history_update()
  RETURNS TRIGGER AS
$$
BEGIN
  IF OLD.unitprice != NEW.unitprice THEN
    INSERT INTO ProductPricingInfo(fromprice, toprice, changedate, productid)
      VALUES(OLD.unitprice, NEW.unitprice, NOW(), OLD.id);
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION pricing_history_newproduct()
  RETURNS TRIGGER AS
$$
BEGIN
    INSERT INTO ProductPricingInfo(toprice, changedate, productid)
      VALUES(NEW.unitprice, NOW(), NEW.id);
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';



CREATE TRIGGER ProductPricingUpdate
  AFTER UPDATE ON Product
  FOR EACH ROW
  EXECUTE PROCEDURE pricing_history_update();

CREATE TRIGGER ProductPricingInsert
  AFTER INSERT ON Product
  FOR EACH ROW
  EXECUTE PROCEDURE pricing_history_newproduct();