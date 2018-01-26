-- Put your SQLite "down" migration here
DROP TABLE ProductPricingInfo;
DROP TRIGGER ProductPricingInsert;
DROP TRIGGER ProductPricingUpdate;