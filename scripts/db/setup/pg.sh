#!/usr/bin/env sh
echo "\033[0;32mSetting Up PostgreSQL Database. This may take a few minutes...\033[0m"
echo "\033[1;33m - Removing any existing nw_postgresql database (if this hangs: \"killall -9 psql\")\033[0m"
dropdb nw_postgresql
echo "\033[1;33m - Removing any existing northwind_user user\033[0m"
dropuser northwind_user

echo "\033[1;33m - Creating nw_postgresql database\033[0m"
createdb nw_postgresql

echo "\033[1;33m - Ensuring plpgsql extension is installed\033[0m"
psql nw_postgresql -c "CREATE EXTENSION IF NOT EXISTS plpgsql" 

echo "\033[1;33m - Importing data from northwind.sql (this may take a while)\033[0m"
psql nw_postgresql < ./northwind.sql -q 

echo "\033[1;33m - Creating user: northwind_user\033[0m"
psql template1 -c "create user northwind_user;"
psql template1 -c "alter user northwind_user password 'thewindisblowing';"
echo "\033[1;33m - Assigning ownership of nw_postgresql database to northwind_user\033[0m"
psql template1 -c "grant all on DATABASE nw_postgresql to northwind_user;"
psql nw_postgresql -c "GRANT ALL on ALL tables IN SCHEMA public to northwind_user"
psql nw_postgresql -c "alter table \"order\" owner to northwind_user"
psql nw_postgresql -c "alter table \"orderdetail\" owner to northwind_user"
psql nw_postgresql -c "alter table \"product\" owner to northwind_user"
psql nw_postgresql -c "alter table \"employee\" owner to northwind_user"
psql nw_postgresql -c "alter table \"customer\" owner to northwind_user"
psql nw_postgresql -c "alter table \"supplier\" owner to northwind_user"
