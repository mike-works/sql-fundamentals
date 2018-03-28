-- Put your SQLite "down" migration here
DROP TABLE ProductPricingInfo;
DROP TRIGGER ProductPricingUpdate;
DROP TRIGGER ProductPricingInsert;