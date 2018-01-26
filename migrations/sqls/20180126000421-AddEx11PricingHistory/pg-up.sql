-- Put your PostgreSQL "up" migration here
CREATE TABLE ProductPricingInfo (
  id                SERIAL PRIMARY KEY,
  fromprice         REAL,
  toprice           REAL  NOT NULL,
  changedate        TEXT  NOT NULL,
  productid         INTEGER       NOT NULL,
  FOREIGN KEY (productid) REFERENCES Product(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION pricing_history_update()
  RETURNS trigger AS
$$
BEGIN
    INSERT INTO ProductPricingInfo (fromprice, toprice, changedate, productid) VALUES (OLD.unitprice, new.unitprice, clock_timestamp(), new.id);
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION pricing_history_insert()
  RETURNS trigger AS
$$
BEGIN
    INSERT INTO ProductPricingInfo (fromprice, toprice, changedate, productid) VALUES (null, new.unitprice, clock_timestamp(), new.id);
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
EXECUTE PROCEDURE pricing_history_insert();
