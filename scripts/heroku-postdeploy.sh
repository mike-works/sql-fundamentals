#!/usr/bin/env sh
psql $DATABASE_URL < northwind.sql -q
npm run db:migrate:pg --- up
