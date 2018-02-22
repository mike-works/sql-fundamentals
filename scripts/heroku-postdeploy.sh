#!/usr/bin/env sh
echo "BEGINNING POSTDEPLOY"
# psql \$DATABASE_URL?ssl=true < northwind.sql -q
echo "FINISHED POSTDEPLOY"