#!/bin/bash
# 将 env.development.local 同步至 dev-2, 供分支 CI 读取以生成 sdk-next
# Like a lot of other things, 你需要先获取 dev-2 的 ssh 权限, 请联系 @jiangyu

source scripts/utils.sh

envfile='env/.env.development.local'
dest="root@dev-2.seiue.com:/home/seiue/res"
branch=$(git rev-parse --abbrev-ref HEAD)

if [ -f "$envfile" ]; then
  info "同步 .env.development.local 至 dev-2"
  scp $envfile "$dest/.env.development.$branch" || exit 1
fi