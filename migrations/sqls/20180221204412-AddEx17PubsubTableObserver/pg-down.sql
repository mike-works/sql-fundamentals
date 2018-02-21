-- Put your PostgreSQL "down" migration here
DROP TRIGGER IF EXISTS order_notify_update ON CustomerOrder;
DROP TRIGGER IF EXISTS order_notify_insert ON CustomerOrder;
DROP TRIGGER IF EXISTS order_notify_delete ON CustomerOrder;
DROP FUNCTION table_update_notify();