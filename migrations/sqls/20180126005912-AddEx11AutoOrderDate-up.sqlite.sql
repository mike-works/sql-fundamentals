CREATE TRIGGER OrderTransaction
AFTER INSERT ON "transaction"
FOR EACH ROW
BEGIN
    UPDATE "order" SET orderdate = current_date WHERE id = NEW.orderid;
END;