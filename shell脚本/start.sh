#!/bin/bash

source scripts/utils.sh

target=$1

if [ "$target" == "" ]
then
  error "请用参数指定目标应用 (chalk|apollo|go|go:app|storybook)"
  exit 1
fi

if [ ! -f packages/src/sdks-next/chalk/reflection.ts ]
then
  error "请先用 yarn sdk-next 生成 SDK"
  exit 1
fi

if [ "$target" == "storybook" ] || [ "$target" == "sb" ]
then
  NODE_OPTIONS=--max_old_space_size=4096 start-storybook -p 6006 --docs
  exit 0
fi

if [ "$target" == "go:app" ]
then
  cd ./apps/go && yarn start:app
  exit 0
fi

cd ./apps/$target && yarn start
