#!/usr/bin/env sh
echo "\033[0;32mSetting Up PostgreSQL Database. This may take a few minutes...\033[0m"
echo "\033[1;33m - Removing any existing northwind database (if this hangs: \"killall -9 psql\")\033[0m"
dropdb northwind
echo "\033[1;33m - Removing any existing northwind_user user\033[0m"
dropuser northwind_user

echo "\033[1;33m - Creating northwind database\033[0m"
createdb northwind

echo "\033[1;33m - Ensuring plpgsql extension is installed\033[0m"
psql northwind -c "CREATE EXTENSION IF NOT EXISTS plpgsql" 

echo "\033[1;33m - Setting up schema from ./sql/northwind.pg.sql \033[0m"
psql northwind < ./sql/northwind.pg.sql -q 
echo "\033[1;33m - Importing data from ./sql/northwind_data.sql (this may take a while)\033[0m"
psql northwind < ./sql/northwind_data.sql -q 

echo "\033[1;33m - Creating user: northwind_user\033[0m"
psql template1 -c "create user northwind_user;"
psql template1 -c "alter user northwind_user password 'theWindi\$bl0wing';"
echo "\033[1;33m - Assigning ownership of northwind database to northwind_user\033[0m"
psql template1 -c "grant all on DATABASE northwind to northwind_user;"
psql northwind -c "GRANT ALL on ALL tables IN SCHEMA public to northwind_user"
psql northwind -c "alter table \"customerorder\" owner to northwind_user"
psql northwind -c "alter table \"orderdetail\" owner to northwind_user"
psql northwind -c "alter table \"product\" owner to northwind_user"
psql northwind -c "alter table \"employee\" owner to northwind_user"
psql northwind -c "alter table \"customer\" owner to northwind_user"
psql northwind -c "alter table \"supplier\" owner to northwind_user"
