#!/bin/bash
if [ -z "$TRAVIS_BRANCH" ]
then
  git_branch=$(git symbolic-ref --short -q HEAD)
else
  git_branch=$TRAVIS_BRANCH
fi  
echo "Git Branch: $git_branch"

if [ $1 ]
then
  filter=$1
else
  filter='BEGIN'
fi
echo "Test Filter: $filter"

if [ $git_branch = 'solutions' ]
then
  NODE_ENV=test ./node_modules/.bin/mocha --require ts-node/register ./tests/*.test.ts
else 
  NODE_ENV=test ./node_modules/.bin/mocha --grep $filter --require ts-node/register ./tests/*.test.ts
fi