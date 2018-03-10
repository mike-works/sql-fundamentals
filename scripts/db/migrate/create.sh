#!/usr/bin/env sh
./node_modules/.bin/db-migrate create -e sqlite $1 $2 $3 $4 --sql-file