-- Put your PostgreSQL "up" migration here
--  
CREATE MATERIALIZED VIEW MV_CustomerLeaderboard AS
  SELECT c.companyname AS name,
          sum((od.unitprice * od.quantity))as amount
  FROM Customer AS c
  INNER JOIN CustomerOrder AS o
      ON o.customerid = c.id
  INNER JOIN OrderDetail AS od
      ON o.id = od.orderid
  GROUP BY  c.id
  ORDER BY  amount DESC LIMIT 5;

CREATE MATERIALIZED VIEW MV_EmployeeLeaderboard AS
  SELECT (e.firstname || ' ' || e.lastname) AS name, sum((od.unitprice * od.quantity))as amount
  FROM Employee AS e
  INNER JOIN CustomerOrder AS o
      ON o.employeeid = e.id
  INNER JOIN OrderDetail AS od
      ON o.id = od.orderid
  GROUP BY  e.id
  ORDER BY  amount DESC LIMIT 5;

CREATE MATERIALIZED VIEW MV_ProductLeaderboard AS
  SELECT p.productname AS name,
          sum(od.unitprice * od.quantity) AS amount
  FROM OrderDetail AS od
  INNER JOIN CustomerOrder AS o
      ON od.orderid = o.id
  INNER JOIN Product AS p
      ON od.productid = p.id
  GROUP BY  p.id
  ORDER BY  amount DESC LIMIT 5;

CREATE MATERIALIZED VIEW MV_RecentOrders AS
  SELECT o.id,
        (e.firstname || ' ' || e.lastname) AS employee, c.companyname AS customer, o.orderdate, sum(od.unitprice * od.quantity) AS subtotal
  FROM CustomerOrder AS o
  INNER JOIN OrderDetail AS od
      ON od.orderid = o.id
  INNER JOIN Employee AS e
      ON o.employeeid = e.id
  INNER JOIN Customer AS c
      ON o.customerid = c.id
  WHERE o.orderdate IS NOT NULL
  GROUP BY  o.id, e.firstname, e.lastname, c.companyname
  ORDER BY  o.orderdate DESC LIMIT 5;


CREATE OR REPLACE FUNCTION refresh_dashboard_data() returns TRIGGER AS
$$
  BEGIN
    REFRESH MATERIALIZED VIEW MV_CustomerLeaderboard;
    REFRESH MATERIALIZED VIEW MV_ProductLeaderboard;
    REFRESH MATERIALIZED VIEW MV_EmployeeLeaderboard;
    REFRESH MATERIALIZED VIEW MV_RecentOrders;
    RETURN NEW;
  END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER dashboard_update_for_order
AFTER UPDATE ON CustomerOrder
FOR EACH ROW
EXECUTE PROCEDURE refresh_dashboard_data();

CREATE TRIGGER dashboard_update_for_order_delete
AFTER DELETE ON CustomerOrder
FOR EACH ROW
EXECUTE PROCEDURE refresh_dashboard_data();
