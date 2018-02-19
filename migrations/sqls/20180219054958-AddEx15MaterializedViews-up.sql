CREATE MATERIALIZED VIEW "customer_leaderboard" AS 
(SELECT c.companyname as name, sum((od.unitprice * od.quantity))as amount FROM
  Customer as c INNER JOIN "order" as o
  ON o.customerid = c.id
  INNER JOIN OrderDetail as od
  ON o.id = od.orderid
  GROUP BY c.id
  ORDER BY amount desc
  LIMIT 5)
  WITH DATA;

CREATE MATERIALIZED VIEW "employee_leaderboard" AS 
(SELECT (e.firstname || ' ' || e.lastname) as name, sum((od.unitprice * od.quantity))as amount FROM 
  Employee as e INNER JOIN "order" as o
  ON o.employeeid = e.id
  INNER JOIN OrderDetail as od
  ON o.id = od.orderid
  GROUP BY e.id
  ORDER BY amount desc
  LIMIT 5)
  WITH DATA;

CREATE MATERIALIZED VIEW "product_leaderboard" AS 
(SELECT p.productname as name, sum(od.unitprice * od.quantity) as amount
FROM
  OrderDetail AS od
  INNER JOIN "order" AS o ON od.orderid = o.id
  INNER JOIN Product AS p ON od.productid = p.id
GROUP BY p.id
ORDER BY amount DESC
LIMIT 5)
  WITH DATA;

CREATE MATERIALIZED VIEW "recent_orders" AS 
(SELECT o.id, (e.firstname || ' ' || e.lastname) as employee, c.companyname as customer, o.orderdate, sum(od.unitprice * od.quantity) as subtotal FROM
  "order" as o
  INNER JOIN OrderDetail AS od ON od.orderid = o.id
  INNER JOIN Employee AS e on o.employeeid = e.id
  INNER JOIN Customer AS c on o.customerid = c.id
  WHERE o.orderdate NOTNULL
  GROUP BY o.id, e.firstname, e.lastname, c.companyname
  ORDER BY o.orderdate DESC
  LIMIT 5)
  WITH DATA;
