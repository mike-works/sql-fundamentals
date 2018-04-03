-- Put your PostgreSQL "down" migration here
DROP TRIGGER order_notify_update;
DROP TRIGGER order_notify_insert;
DROP TRIGGER order_notify_delete;
