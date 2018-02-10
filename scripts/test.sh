#!/usr/bin/env sh
if [ -z "$TRAVIS_BRANCH" ]
then
  git_branch=$(git symbolic-ref --short -q HEAD)
else
  git_branch=$TRAVIS_BRANCH
fi  
echo "Git Branch: $git_branch"

case $git_branch in
master)
  filter="EX000"
  ;;
solutions-fundamentals)
  filter="EX0"
  ;;
solutions-pro)
  filter="EX"
  break
  ;;
*)
  if [ $1 ]
  then
    filter=$1
  else
    filter='BEGIN'
  fi
  ;;
esac
echo "Test Filter: $filter"

if [ \( $git_branch = *'solution'* \) ] &&  [ \( $filter = 'BEGIN' \) ]
then
  echo "Solutions branch with no filter"
  NODE_ENV=test ./node_modules/.bin/mocha --require ts-node/register ./tests/*.test.ts
else
  echo "Applying Test Filter: $filter"
  NODE_ENV=test ./node_modules/.bin/mocha --grep $filter --require ts-node/register ./tests/*.test.ts
fi