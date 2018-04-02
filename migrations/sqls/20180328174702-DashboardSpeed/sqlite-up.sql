-- Put your SQLite "up" migration here
CREATE VIEW V_CustomerLeaderboard AS 
  SELECT
    c.companyname as name,
    SUM(od.unitprice * od.quantity) as amount
  FROM
    Customer as c
    INNER JOIN CustomerOrder as o ON o.customerid = c.id
    INNER JOIN OrderDetail as od ON o.id = od.orderid
  GROUP BY
    c.id
  ORDER BY
    amount desc
  LIMIT
    5;

CREATE VIEW V_EmployeeLeaderboard AS 
  SELECT
    (e.firstname || ' ' || e.lastname) as name,
    sum(od.unitprice * od.quantity) as amount
  FROM
    Employee as e
    INNER JOIN CustomerOrder as o ON o.employeeid = e.id
    INNER JOIN OrderDetail as od ON o.id = od.orderid
  GROUP BY
    e.id
  ORDER BY
    amount desc
  LIMIT
    5;

CREATE VIEW V_ProductLeaderboard AS 
  SELECT
    p.productname as name,
    sum(od.unitprice * od.quantity) as amount
  FROM
    OrderDetail AS od
    INNER JOIN CustomerOrder AS o ON od.orderid = o.id
    INNER JOIN Product AS p ON od.productid = p.id
  GROUP BY
    p.id
  ORDER BY
    amount DESC
  LIMIT
    5;

CREATE VIEW V_RecentOrders AS
  SELECT
    o.id,
    (e.firstname || ' ' || e.lastname) as employee,
    c.companyname as customer,
    o.orderdate,
    sum(od.unitprice * od.quantity) as subtotal
  FROM
    CustomerOrder as o
    INNER JOIN OrderDetail AS od ON od.orderid = o.id
    INNER JOIN Employee AS e on o.employeeid = e.id
    INNER JOIN Customer AS c on o.customerid = c.id
  WHERE
    o.orderdate IS NOT NULL
  GROUP BY
    o.id,
    e.firstname,
    e.lastname,
    c.companyname
  ORDER BY
    o.orderdate DESC
  LIMIT
    5;

DROP TABLE IF EXISTS MV_CustomerLeaderboard;
DROP TABLE IF EXISTS MV_EmployeeLeaderboard;
DROP TABLE IF EXISTS MV_ProductLeaderboard;
DROP TABLE IF EXISTS MV_RecentOrders;

CREATE TABLE MV_CustomerLeaderboard AS SELECT * FROM V_CustomerLeaderboard;
CREATE TABLE MV_EmployeeLeaderboard AS SELECT * FROM V_EmployeeLeaderboard;
CREATE TABLE MV_ProductLeaderboard AS SELECT * FROM V_ProductLeaderboard;
CREATE TABLE MV_RecentOrders AS SELECT * FROM V_RecentOrders;

CREATE TRIGGER dashboard_update_for_order
  AFTER UPDATE ON CustomerOrder
  FOR EACH ROW
BEGIN
  DELETE FROM MV_CustomerLeaderboard;
  DELETE FROM MV_EmployeeLeaderboard;
  DELETE FROM MV_ProductLeaderboard;
  DELETE FROM MV_RecentOrders;

  INSERT INTO MV_CustomerLeaderboard SELECT * FROM V_CustomerLeaderboard;
  INSERT INTO MV_EmployeeLeaderboard SELECT * FROM V_EmployeeLeaderboard;
  INSERT INTO MV_ProductLeaderboard SELECT * FROM V_ProductLeaderboard;
  INSERT INTO MV_RecentOrders SELECT * FROM V_RecentOrders;
END;


CREATE TRIGGER dashboard_update_for_delete
  AFTER DELETE ON CustomerOrder
  FOR EACH ROW
BEGIN
  DELETE FROM MV_CustomerLeaderboard;
  DELETE FROM MV_EmployeeLeaderboard;
  DELETE FROM MV_ProductLeaderboard;
  DELETE FROM MV_RecentOrders;

  INSERT INTO MV_CustomerLeaderboard SELECT * FROM V_CustomerLeaderboard;
  INSERT INTO MV_EmployeeLeaderboard SELECT * FROM V_EmployeeLeaderboard;
  INSERT INTO MV_ProductLeaderboard SELECT * FROM V_ProductLeaderboard;
  INSERT INTO MV_RecentOrders SELECT * FROM V_RecentOrders;
END;