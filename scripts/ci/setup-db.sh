#!/bin/bash
if [ -n $DB_TYPE ]
then
  if [[ $DB_TYPE == "postgres" ]]
  then
    echo "setting up postgres"
    npm run pg:setup
    npm run db:migrate --- up -e pg
    exit
  else
    echo "setting up sqlite"
    rm -f dev.sqlite
    cp master.sqlite dev.sqlite
    npm run db:migrate --- up
    exit
  fi
else
  echo -e "DB_TYPE not set\n"
fi
