-- Put your PostgreSQL "down" migration here
DROP TABLE ProductPricingInfo;
DROP TRIGGER ProductPricingUpdate ON Product;
DROP TRIGGER ProductPricingInsert ON Product;