-- Put your PostgreSQL "up" migration here
CREATE OR REPLACE FUNCTION table_update_notify() RETURNS trigger AS $$
DECLARE
  id bigint;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    id = NEW.id;
  ELSE
    id = OLD.id;
  END IF;
  PERFORM pg_notify('table_update', json_build_object('table', TG_TABLE_NAME, 'id', id, 'type', TG_OP)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_notify_update AFTER UPDATE ON CustomerOrder FOR EACH ROW EXECUTE PROCEDURE table_update_notify();
CREATE TRIGGER order_notify_insert AFTER INSERT ON CustomerOrder FOR EACH ROW EXECUTE PROCEDURE table_update_notify();
CREATE TRIGGER order_notify_delete AFTER DELETE ON CustomerOrder FOR EACH ROW EXECUTE PROCEDURE table_update_notify();