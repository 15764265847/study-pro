#!/bin/bash
# this script assumes it's run on dev-2

source scripts/utils.sh

ci_only

dist=/home/seiue/c3-frontend/docs
typedoc --options .typedoc/typedoc.config.js || exit 1
rm -Rf $dist && cp -r docs $dist || exit 1
