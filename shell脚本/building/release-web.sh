#!/bin/bash

source scripts/utils.sh

ci_only

prod_host="root@fe-1.seiue.com"
prod_folder="/home/seiue/c3-frontend"
ssh_prod_host="ssh -o StrictHostKeyChecking=no $prod_host"
root=$(pwd)

for app in ./apps/*/; do
  local_package_json="$app./package.json"
  local_version=$(cat $local_package_json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g' \
    | tr -d '[[:space:]]')

  prod_app="$prod_folder/$app."
  prod_package_json="$prod_app/package.json"

  if $ssh_prod_host stat $prod_package_json \> /dev/null 2\>\&1; then
    prod_version=$($ssh_prod_host cat $prod_package_json \
      | grep version \
      | head -1 \
      | awk -F: '{ print $2 }' \
      | sed 's/[",]//g' \
      | tr -d '[[:space:]]')
  else
    prod_version="[package.json.not.found]"
  fi

  if [ $local_version != $prod_version ]; then
    info "$app is at $prod_version. Target version is $local_version. Start building..."

    cd $app

    $root/scripts/building/build-helper.sh yarn build || exit 1

    if [ $app = "./apps/chalk/" ]; then
      # 检查 js/css chunk 均不超过 5.3m (gzip 后 1.1m 左右)，保证首屏加载速度
      node $root/scripts/limit-chunk-size $(pwd)/build 5.3 || exit 1
    fi

    # rsync时，如果文件夹不存在，会报错。在此处先递归创建文件夹
    ssh $prod_host mkdir -p $prod_app

    # 替换 index.html 等入口，但保留 static 中旧文件, 不中断用户对旧版本网页的使用
    # 版本更新通过 api 版本管理和 web 版本自动检查来提示用户刷新页面
    rsync -avPz -e ssh --exclude="*.html" build/ "$prod_host:$prod_app" || exit 1

    # 先上传其他资源文件再上传 html 文件，防止资源还在上传时用户访问新 index.html 导致 CDN 缓存了损坏文件
    rsync -avPz -e ssh --include="*.html" build/ "$prod_host:$prod_app" || exit 1

    # Update package.json to record latest version
    scp ./package.json $prod_host:$prod_package_json || exit 1

    info "$app is successfully updated to $local_version."

    # Send changelog to dingding - Release Notes
    node $root/packages/src/changelog/ding.js $app $prod_version $local_version

    # Go back to root for next loop
    cd $root
  else
    info "$app is up to date at $prod_version. Building skipped."
  fi
done
