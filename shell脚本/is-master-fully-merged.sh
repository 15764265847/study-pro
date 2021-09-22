#!/bin/bash
# Ensure origin/master has been fully merged into current branch.
# This is a standalone file not a function because fastlane needs to call it.

source $(cd "$(dirname "$0")";pwd)/utils.sh

git fetch
current_branch=$(git rev-parse --abbrev-ref HEAD)
master_diff=$(git branch --list -v -r --no-merged $current_branch origin/master)
if [ ! -z "${master_diff}" ]; then
  error "origin/master 分支上有新的改动. 请先合并 origin/master 到当前分支上."
  exit 1
fi
