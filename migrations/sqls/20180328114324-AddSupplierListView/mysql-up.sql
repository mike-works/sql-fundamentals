-- Put your MySQL "up" migration here
CREATE VIEW SupplierList_V AS
  SELECT
  sp.id,
  sp.contactname,
  sp.companyname,
  group_concat(
    sp.productname
    ORDER BY
      sp.productname ASC SEPARATOR ', '
  ) AS productlist
FROM
  (
    SELECT
      s.id,
      s.contactname,
      s.companyname,
      p.productname
    FROM
      Supplier AS s
      LEFT JOIN Product AS p ON p.supplierid = s.id
    ORDER BY
      s.id ASC,
      p.productname ASC
  ) AS sp
GROUP BY
  sp.id,
  sp.contactname,
  sp.companyname
ORDER BY
  sp.id;