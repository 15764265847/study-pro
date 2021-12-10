#!/bin/bash

warning () {
  echo ""
  echo "⚠️ WARNING: $@";
}

error () {
  echo ""
  echo "🚫 ERROR: $@";
}

info () {
  echo ""
  echo "💬 INFO: $@";
}

success () {
  echo ""
  echo "🎉 SUCCESS: $@";
}

# Limit this script to dev CI machine
ci_only() {
  if [ -z "${CI}" ]; then
    error 'This script is for CI only.'
    exit 1
  fi
}

# Ensure git status is clean and push latest commits to remote
# Developer can skip with SKIP_PRECHECK=1
git_precheck() {
  if [ -z "${SKIP_PRECHECK}" ]; then
    # Step 0: check for uncommitted changes
    git status
    git diff-index --quiet HEAD -- || { error '请先 stash 或 commit 你当前的改动.'; exit 1; }

    # Step 1: push current branch to remote
    info '正在将当前分支同步至 GitLab.'
    git push || exit 1
  fi
}

# Ensure master branch is fully merged into current branch
is_master_fully_merged() {
  ./scripts/is-master-fully-merged.sh || exit 1
}

generate_production_sdk() {
  yarn sdk-next .env.development
}