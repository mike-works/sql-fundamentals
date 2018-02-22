#!/usr/bin/env sh
echo "BEGINNING POSTDEPLOY"
psql $DATABASE_URL < northwind.sql -q
echo "FINISHED POSTDEPLOY"