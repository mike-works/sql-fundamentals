#!/usr/bin/env sh
heroku run "psql \$DATABASE_URL < northwind.sql -q"
heroku run "npm run db:migrate:pg --- up"