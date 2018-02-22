#!/usr/bin/env sh
echo "BEGINNING POSTBUILD"
npm run db:migrate:pg --- up
echo "FINISHED POSTBUILD"