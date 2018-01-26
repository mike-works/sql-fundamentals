-- Put your PostgreSQL "up" migration here
CREATE UNIQUE INDEX OrderDetailUniqueProduct ON OrderDetail (productid, orderid);