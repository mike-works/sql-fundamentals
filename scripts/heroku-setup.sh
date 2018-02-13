#!/usr/bin/env sh
npm run build
psql $DATABASE_URL < northwind.sql -q
npm run db:migrate:pg --- up