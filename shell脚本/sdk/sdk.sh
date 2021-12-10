#!/bin/bash

# usage: yarn sdk <envfile> <server_name>

source scripts/utils.sh

# define our list of services
servers=("chalk" "apollo" "platform" "vms" "scms" "sams" "vnas" "sgms")
results=()

envfile=$1

# specifiedServers priority is higher than servers
specifiedServers=()
for specifiedServer in "${@:2}"
do
  specifiedServers+=("$specifiedServer")
done

if [ ${#specifiedServers[@]} -gt 0 ]
then
  servers=("${specifiedServers[@]}")
fi

if [ -z "$envfile" ]
then
  info "envfile defaults to <.env.development.local>"
  envfile=".env.development.local"
else
  info "using <$envfile> as envfile"
fi

envfilePath="env/$envfile"

if [ ! -f "$envfilePath" ]; then
  error "<$envfile> not found!"
  exit 1
fi

envs=()

if [[ $envfile =~ \.local$ ]]
then
  envfileFallback=${envfile/.local/}
  envfileFallbackPath="env/$envfileFallback"
  if [ -f "$envfilePath" ]
  then
    info "using <$envfileFallback> as fallback envfile. Env vars not defined in <${envfile}> will use values from <${envfileFallback}>"

    # read fallback values first from $envfileFallback
    while read -r line || [ -n "$line" ]
    do
      envs=( "${envs[@]}" "$line" )
    done < "$envfileFallbackPath"
  fi
fi

# read override values from $envfile
while read -r line || [ -n "$line" ]
do
  envs=( "${envs[@]}" "$line" )
done < "$envfilePath"

# generate sdks
for server in "${servers[@]}"
do
  serverEnv=""
  serverKey=$(echo "SERVER_${server}=" | tr '[:lower:]' '[:upper:]' | sed 's/-/_/g')

  # find server env line. $envfile will override $envfileFallback
  for env in "${envs[@]}"; do
    if [[ $env =~ $serverKey ]]; then
      serverEnv=$env
    fi
  done

  serverBranch=$(echo "$serverEnv" | cut -d "." -f 2)
  template="./packages/src/sdks/_template"
  apiDocServer="http://api-doc.dev.seiue.com"
  fileName="openapi.json"
  in="./packages/src/sdks/$server/doc.json"
  out="./packages/src/sdks/$server"

  # recreate target folder
  if [ -d "$out" ]; then rm -Rf $out; fi
  mkdir $out

  # 按目前的规则，如果 host 用 . 分割的第二个字符为 seiue 或 ci，则表示用后端 master 分支生成，如下：
  # http://platform.ci.seiue.com: master
  # https://platform.seiue.com: master
  # http://platform.backend-branch.ci.seiue.com: backend-branch
  if [[ $serverBranch == "seiue" ]] || [[ $serverBranch == "ci" ]]
  then
    curl $apiDocServer/$server/$fileName > $in
  else
    curl $apiDocServer/$server/$serverBranch/$fileName > $in
  fi


  # 将已完全使用 sdk-next 不再依赖旧 sdk 的 api group 从 doc 中移除
  info "trimming $server SDK"
  node ./scripts/sdk/trim-sdk.js $in $server

  # generate sdk
  info "generating $server SDK"
  openapi-generator generate -t $template -g typescript-axios -i $in -o $out --additional-properties=modelPropertyNaming=camelCase || exit 1

  # remove not-used files and use api.ts as index
  rm $out/configuration.ts $out/git_push.sh $out/index.ts $out/base.ts
  mv $out/api.ts $out/index.ts

  # inject server name (macOS needs '' after -i to make it work)
  sed -i '' "s/@SERVER_NAME/$server/g" $out/index.ts

  # patch interfaces
  node ./packages/src/sdks/_post-process/patch-interfaces.js $server $out/index.ts || exit 1

  # generate normalizr schemas
  node ./packages/src/sdks/_post-process/generate-schemas.js $server $out/index.ts || exit 1

  # prettier
  prettier --write "$out/**/*" --loglevel silent

  results=( "${results[@]}" "\n✅ $server/$serverBranch" )
done

echo "${results[@]}"

./scripts/sdk/sdk-next.sh $envfile

