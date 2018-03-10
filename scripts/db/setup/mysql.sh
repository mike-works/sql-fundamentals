#!/usr/bin/env sh
echo "\033[0;32mSetting Up PostgreSQL Database. This may take a few minutes...\033[0m"
echo "\033[1;33m - Removing any existing northwind database (you may need to provide a password)\033[0m"
mysqladmin -uroot -f --password="$MYSQL_ROOT_PW" drop northwind
echo "\033[1;33m - Removing any existing northwind_user user\033[0m"
mysql -uroot -f --password="$MYSQL_ROOT_PW" -e "drop user 'northwind_user'@'localhost'";

echo "\033[1;33m - Creating northwind_user\033[0m"
mysql -uroot -f --password="$MYSQL_ROOT_PW" -e "create user 'northwind_user'@'localhost' IDENTIFIED BY 'theWindi\$bl0wing';";

echo "\033[1;33m - Creating northwind database\033[0m"
mysqladmin -uroot -f --password="$MYSQL_ROOT_PW" create 'northwind';

echo "\033[1;33m - Granting all northwind database permissions to northwind_user\033[0m"
mysql -uroot -f --password="$MYSQL_ROOT_PW" -e "GRANT ALL PRIVILEGES ON northwind.* TO 'northwind_user'@'localhost';FLUSH PRIVILEGES;";

# echo "\033[1;33m - Ensuring plpgsql extension is installed\033[0m"
# psql nw_postgresql -c "CREATE EXTENSION IF NOT EXISTS plpgsql" 

echo "\033[1;33m - Setting up schema from ./sql/northwind.mysql.sql \033[0m"
mysql -uroot -f --password="$MYSQL_ROOT_PW" -D northwind < ./sql/northwind.mysql.sql
echo "\033[1;33m - Importing data from ./sql/northwind_data.sql (this may take a while)\033[0m"
mysql -uroot -f --password="$MYSQL_ROOT_PW" -D northwind < ./sql/northwind_data.sql

