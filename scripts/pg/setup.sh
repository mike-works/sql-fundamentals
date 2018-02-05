#!/bin/bash
dropdb nw_postgresql
dropuser northwind_user

createdb nw_postgresql
psql nw_postgresql < ./northwind.sql -q 

psql template1 -c "create user northwind_user;"
psql template1 -c "alter user northwind_user password 'thewindisblowing';"
psql template1 -c "grant all on DATABASE nw_postgresql to northwind_user;"
psql nw_postgresql -c "GRANT ALL on ALL tables IN SCHEMA public to northwind_user"
psql nw_postgresql -c "alter table \"order\" owner to northwind_user"
psql nw_postgresql -c "alter table \"orderdetail\" owner to northwind_user"
psql nw_postgresql -c "alter table \"product\" owner to northwind_user"
psql nw_postgresql -c "alter table \"employee\" owner to northwind_user"
