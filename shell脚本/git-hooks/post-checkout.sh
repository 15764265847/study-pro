#!/bin/bash

# download env.development.local for the branch you check out

# 0: file checkout; 1: branch checkout
if [ "$3" == "0" ]; then exit; fi

branch=$(git rev-parse --abbrev-ref HEAD)

# no need to download for master
if [ "$branch" == "master" ]; then
  rm -f env/.env.development.local
  exit
fi

# mute error if file does not exist
scp root@dev-2.seiue.com:/home/seiue/res/.env.development.$branch env/.env.development.local || exit 0

