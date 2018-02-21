#!/usr/bin/env sh
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
  case $git_branch in
  master)
    filter="EX00"
    ;;
  solutions-fundamentals)
    filter="EX[10|09|08|07|06|05|04|03|02|01|00]"
    ;;
  solutions-pro)
    filter="EX"
    break
    ;;
  esac
fi
echo "Test Filter: $filter"

if [ \( $git_branch = *'solution'* \) ] &&  [ \( $filter = 'EX000' \) ]
then
  echo "Solutions branch with no filter"
  NODE_ENV=test ./node_modules/.bin/mocha --require ts-node/register ./tests/*.test.ts $2 $3
else
  echo "Applying Test Filter: $filter"
  NODE_ENV=test ./node_modules/.bin/mocha --grep $filter --require ts-node/register ./tests/*.test.ts $2 $3
fi