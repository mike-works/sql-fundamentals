#!/usr/bin/env sh
echo "\033[0;32mSetting Up MySQL Database. This may take a few minutes...\033[0m"
echo "\033[1;33m - Removing any existing northwind database (you may need to provide a password)\033[0m"
mysqladmin -f drop northwind
echo "\033[1;33m - Removing any existing northwind_user user\033[0m"
mysql -f -e "drop user 'northwind_user'@'localhost'";

echo "\033[1;33m - Creating northwind_user\033[0m"
mysql -f -e "create user 'northwind_user'@'localhost' IDENTIFIED BY 'theWindi\$bl0wing';";

echo "\033[1;33m - Creating northwind database\033[0m"
mysqladmin -f create 'northwind';

echo "\033[1;33m - Granting all northwind database permissions to northwind_user\033[0m"
mysql -uroot -f -e "GRANT ALL PRIVILEGES ON northwind.* TO 'northwind_user'@'localhost';FLUSH PRIVILEGES;";

echo "\033[1;33m - Setting up schema from ./sql/northwind.mysql.sql \033[0m"
mysql -f -D northwind < ./sql/northwind.mysql.sql
echo "\033[1;33m - Importing data from ./sql/northwind_data.sql (this may take a while)\033[0m"
mysql -f -D northwind < ./sql/northwind_data.sql

