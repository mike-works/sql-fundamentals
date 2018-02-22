#!/usr/bin/env sh
echo "BEGINNING POSTDEPLOY"
psql $DATABASE_URL < northwind.sql -q
npm run db:migrate:pg --- up
echo "FINISHED POSTDEPLOY"