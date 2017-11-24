#!/bin/bash
git_branch=$(git symbolic-ref --short -q HEAD)
if [ $1 ]; then
  filter=$1
else
  filter='BEGIN'
fi
echo $filter
if [ git_branch == 'solution' ]; then
  NODE_ENV=test ./node_modules/.bin/mocha --require ts-node/register ./tests/*.test.ts
else 
  NODE_ENV=test ./node_modules/.bin/mocha --grep $filter --require ts-node/register ./tests/*.test.ts
fi