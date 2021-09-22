#!/bin/bash
# this script assumes it's run on dev-2

source scripts/utils.sh

ci_only

dist=/home/seiue/c3-frontend/storybook
NODE_OPTIONS=--max_old_space_size=4096 build-storybook --docs --quiet || exit 1
rm -Rf $dist && cp -r storybook-static $dist || exit 1
