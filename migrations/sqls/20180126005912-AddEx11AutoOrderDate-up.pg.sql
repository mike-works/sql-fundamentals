CREATE OR REPLACE FUNCTION update_order_date()
  RETURNS trigger AS
$$
BEGIN
    UPDATE "order" SET orderdate = current_date WHERE id = NEW.orderid;
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';


CREATE TRIGGER OrderTransaction
AFTER INSERT ON "transaction"
FOR EACH ROW
EXECUTE PROCEDURE update_order_date()
