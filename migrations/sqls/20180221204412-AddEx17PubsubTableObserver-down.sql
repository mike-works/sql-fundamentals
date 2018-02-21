
DROP TRIGGER IF EXISTS order_notify_update ON "order";
DROP TRIGGER IF EXISTS order_notify_insert ON "order";
DROP TRIGGER IF EXISTS order_notify_delete ON "order";
DROP FUNCTION table_update_notify();