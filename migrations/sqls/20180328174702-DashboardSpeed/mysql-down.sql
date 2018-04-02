-- Put your MySQL "down" migration here
DROP VIEW V_CustomerLeaderboard;
DROP VIEW V_EmployeeLeaderboard;
DROP VIEW V_ProductLeaderboard;
DROP VIEW V_RecentOrders;

DROP TABLE IF EXISTS MV_CustomerLeaderboard;
DROP TABLE IF EXISTS MV_EmployeeLeaderboard;
DROP TABLE IF EXISTS MV_ProductLeaderboard;
DROP TABLE IF EXISTS MV_RecentOrders;

DROP TRIGGER IF EXISTS dashboard_update_for_order;
DROP TRIGGER IF EXISTS dashboard_update_for_order_delete;