#!/usr/bin/env sh
# ./node_modules/.bin/db-migrate create -e sqlite $1 $2 $3 $4
DATE_STAMP=$(date "+%Y%m%d%H%M%S")
MIGRATION_NAME="$DATE_STAMP-$1"
echo "import { sqlFileMigration } from '../src/migration-utils';\n\nexport = sqlFileMigration('$MIGRATION_NAME');" > "./migrations/$MIGRATION_NAME.ts"
mkdir "./migrations/sqls/$MIGRATION_NAME"
echo "-- Put your MySQL \"up\" migration here" > "./migrations/sqls/$MIGRATION_NAME/mysql-up.sql"
echo "-- Put your MySQL \"down\" migration here" > "./migrations/sqls/$MIGRATION_NAME/mysql-down.sql"
echo "-- Put your PostgreSQL \"up\" migration here" > "./migrations/sqls/$MIGRATION_NAME/pg-up.sql"
echo "-- Put your PostgreSQL \"down\" migration here" > "./migrations/sqls/$MIGRATION_NAME/pg-down.sql"
echo "-- Put your SQLite \"up\" migration here" > "./migrations/sqls/$MIGRATION_NAME/sqlite-up.sql"
echo "-- Put your SQLite \"down\" migration here" > "./migrations/sqls/$MIGRATION_NAME/sqlite-down.sql"