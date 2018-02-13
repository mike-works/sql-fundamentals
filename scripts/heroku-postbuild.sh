#!/usr/bin/env sh
npm run build
DATABASE_URL=$DATABASE_URL?ssl=true npm run db:migrate:pg --- up