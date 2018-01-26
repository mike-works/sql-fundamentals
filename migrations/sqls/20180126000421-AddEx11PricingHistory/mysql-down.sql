-- Put your MySQL "down" migration here
DROP TRIGGER IF EXISTS ProductPricingUpdate;
DROP TRIGGER IF EXISTS ProductPricingInsert;
DROP TABLE  ProductPricingInfo;