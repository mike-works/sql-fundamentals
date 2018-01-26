-- Put your PostgreSQL "up" migration here
CREATE VIEW SupplierList_V AS
  SELECT sp.id, sp.companyname, sp.contactname, string_agg(sp.productname, ', ')  as productlist FROM
  (SELECT s.id, s.companyname, s.contactname, p.productname FROM  Supplier AS s
  LEFT JOIN Product AS p
    ON p.supplierid=s.id
  ORDER BY s.id ASC, p.productname ASC) as sp
  GROUP BY sp.id, sp.companyname, sp.contactname;