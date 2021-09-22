#!/bin/bash

source scripts/utils.sh

ci_only
root=$(pwd)

# 获取所有项目和插件的位置
for project in ./apps/*/; do
  if [[ $project == */plugins/ ]]
  then
    for plugin in $project/*/; do
      l=${#apps[*]}
      apps[$l]=$plugin
    done
    continue
  fi
  l=${#apps[*]}
  apps[$l]=$project
done

for app in ${apps[*]}; do
  info "Building $app..."

  cd $app

  $root/scripts/building/build-helper.sh yarn build:preview || exit 1

  if [ $app = "./apps/chalk/" ]; then
    # 检查 js/css chunk 均不超过 5.3m (gzip 后 1.1m 左右)，保证首屏加载速度
    node $root/scripts/limit-chunk-size $(pwd)/build 5.3 || exit 1
  fi

  rm -Rf /home/seiue/c3-frontend/$app./branch_develop || exit 1
  cp -r ./build /home/seiue/c3-frontend/$app./branch_develop || exit 1

  info "$app built successfully."

  # Go back to root for next loop
  cd $root
done
