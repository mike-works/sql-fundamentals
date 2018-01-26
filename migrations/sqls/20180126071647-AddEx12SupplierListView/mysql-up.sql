-- Put your MySQL "up" migration here
CREATE VIEW SupplierList_V_part1 AS
  SELECT s.id, s.companyname, s.contactname, p.productname FROM  Supplier AS s
  LEFT JOIN Product AS p
    ON p.supplierid=s.id
  ORDER BY s.id ASC, p.productname ASC;

CREATE VIEW SupplierList_V AS
  SELECT sp.id, sp.companyname, sp.contactname, GROUP_CONCAT(sp.productname ORDER BY sp.productname SEPARATOR ', ')  as productlist FROM
  SupplierList_V_part1 as sp
  GROUP BY sp.id, sp.companyname, sp.contactname;