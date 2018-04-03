-- Put your PostgreSQL "up" migration here
ALTER TABLE Product
  ADD COLUMN metadata JSONB DEFAULT '{ "flavor": { "spicy": -1, "sweet": -1, "sour": -1, "salty": -1, "bitter": -1 } }'::JSONB,
  ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];

CREATE INDEX product_spicy ON Product using GIN ((metadata->'{flavor,spicy}'));
CREATE INDEX product_sweet ON Product using GIN ((metadata->'{flavor,sweet}'));
CREATE INDEX product_salty ON Product using GIN ((metadata->'{flavor,salty}'));
CREATE INDEX product_sour ON Product using GIN ((metadata->'{flavor,sour}'));
CREATE INDEX product_bitter ON Product using GIN ((metadata->'{flavor,bitter}'));
CREATE INDEX product_tags ON Product using GIN (tags);