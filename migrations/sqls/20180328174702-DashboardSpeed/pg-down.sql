-- Put your PostgreSQL "down" migration here
DROP MATERIALIZED VIEW MV_CustomerLeaderboard;
DROP MATERIALIZED VIEW MV_EmployeeLeaderboard;
DROP MATERIALIZED VIEW MV_ProductLeaderboard;
DROP MATERIALIZED VIEW MV_RecentOrders;

DROP TRIGGER dashboard_update_for_order ON CustomerOrder;
DROP TRIGGER dashboard_update_for_order_delete ON CustomerOrder;