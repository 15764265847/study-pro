#!/bin/bash
# Deploy current branch to staging

source scripts/utils.sh

branch=$(git rev-parse --abbrev-ref HEAD)
app=$1
host="root@dev-2.seiue.com"
base="/home/seiue/c3-frontend"
apps="$base/apps"
root=$(pwd)

if [ "$app" == "" ]
then
  error "Provide name of the app you wanna deploy to staging."
  exit 1
fi

if [ ! -f packages/src/sdks-next/chalk/reflection.ts ]
then
  error "请先用 yarn sdk-next 生成 SDK"
  exit 1
fi

info "开始部署分支 $branch 到 staging..."

# Step 1: precheck git
if [ -z "${SKIP_PRECHECK}" ]; then
  git_precheck
  is_master_fully_merged
fi

# Step 2: update node_modules
info 'Installing node_modules...'
yarn install:node || exit 1

# Step 3: build static assets
info 'Building staging assets ... Go get a cup of ☕'
cd apps/"$app" &&
$root/scripts/building/build-helper.sh yarn build:staging || exit 1

# Step 4: upload assets
branch_folder="branch_$branch"
info "Cleaning up $branch_folder"
rm -rf $branch_folder

info '准备上传非 HTML 资源...'
mv build $branch_folder || exit 1
ssh $host mkdir -p $apps/$app
rsync -aqPz -e ssh --exclude="*.html" $branch_folder "$host:$apps/$app" || exit 1
info '非 HTML 资源上传成功'

info '准备上传 HTML 资源...'
rsync -aqPz -e ssh --include="*.html" $branch_folder "$host:$apps/$app" || exit 1
info 'HTML 资源上传成功'

# Step 5: clean up local
info 'Cleaning up...'
rm -rf $branch_folder

# Step 6: clean up outdated assets on server
ssh $host "nohup $base/cleanup.sh"

url="http://$app.$branch.c3.staging.seiue.com"
success "$app/$branch 已成功部署到 $url"

# Send message to dingtalk Releases channel
name=$(git config user.name)
email=$(git config user.email)
ding="curl -H \"Content-Type: application/json\" -X POST --data '{\"msgtype\": \"text\", \"text\": {\"content\": \"${name}(${email}): ${app} staging for branch ${branch} deployed at ${url}\"}}' https://oapi.dingtalk.com/robot/send?access_token=d2e4518295d40f52228e093e70c6e6283c14737d8b65405921ea10bb6d431714"
eval $ding
