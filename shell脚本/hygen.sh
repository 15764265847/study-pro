#!/bin/bash

source scripts/utils.sh

target=$1
action=$2

if [ "$target" == "" ]
then
  error "请指定要执行的 hygen target"
  exit 1
fi

if [ "$action" == "" ]
then
  error "请指定要执行的 hygen action"
  exit 1
fi

node_modules/hygen/dist/bin.js $target $action
