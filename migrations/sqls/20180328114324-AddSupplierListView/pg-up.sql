-- Put your PostgreSQL "up" migration here
CREATE VIEW SupplierList_V AS
  SELECT
    sp.id,
    sp.contactname,
    sp.companyname,
    string_agg(sp.productname, ', ') AS productlist
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
    sp.id