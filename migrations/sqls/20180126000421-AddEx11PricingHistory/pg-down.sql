-- Put your PostgreSQL "down" migration here
DROP TRIGGER IF EXISTS ProductPricingUpdate on Product;
DROP TRIGGER IF EXISTS ProductPricingInsert on Product;
DROP TABLE IF EXISTS ProductPricingInfo;