#!/bin/bash

source scripts/utils.sh

target=$1

if [ "$target" == "" ]
then
  error "请指定目标应用"
  exit 1
fi

is_master_fully_merged

git pull || exit 1

cd apps/$target || exit 1
git add CHANGELOG.md
name="$target"

yarn config set version-git-message "$name: v%s"
yarn config set version-tag-prefix "$target@"
yarn version || exit 1
git push || exit 1
git push --tag || exit 1

