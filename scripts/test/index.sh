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
    filter="EX0[0-9]|10"
    ;;
  solutions-pro)
    filter="EX"
    break
    ;;
  *)
    filter="EX00"
    break
    ;;
  esac
fi
echo "Test Filter: $filter"

if [ \( $git_branch = *'solution'* \) ] &&  [ \( $filter = 'EX000' \) ]
then
  echo "Solutions branch with no filter"
  NODE_ENV=test ./node_modules/.bin/mocha $1 $2 $3
else
  echo "Applying Test Filter: $filter"
  NODE_ENV=test ./node_modules/.bin/mocha --grep $filter $2 $3
fi