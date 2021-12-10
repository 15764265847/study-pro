#!/bin/bash

# usage: yarn sdk <envfile>

source scripts/utils.sh

# define our list of services
servers=("chalk" "scms" "sams" "sgms" "vnas" "platform" "form" "apollo" "nuwa")

info "Generating sdks-next 🎉"

envfile=$1

if [ -z "$envfile" ]; then
  if [ -f env/.env.development.local ]; then
    info "Envfile defaults to <.env.development.local>"
    envfile=".env.development.local"
  else
    info "Envfile defaults to <.env.development>"
    envfile=".env.development"
  fi
else
  info "Using <$envfile> as envfile"
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
    info "Using <$envfileFallback> as fallback envfile. Env vars not defined in <${envfile}> will use values from <${envfileFallback}>"

    # read fallback values first from $envfileFallback
    while read -r line || [ -n "$line" ]
    do
      # just use a-Z start lines, ignore start with #
      if [ $(expr "$line" : '^[a-zA-Z]') -gt 0 ]; then
        envs=( "${envs[@]}" "$line" )
      fi
    done < "$envfileFallbackPath"
  fi
fi

# read override values from $envfile
while read -r line || [ -n "$line" ]
do
  # just use a-Z start lines, ignore start with #
  if [ $(expr "$line" : '^[a-zA-Z]') -gt 0 ]; then
    envs=( "${envs[@]}" "$line" )
  fi
done < "$envfilePath"

# generate sdks
for server in "${servers[@]}"
do
  serverEnv=""
  docEnv=""
  serverKey=$(echo "SERVER_${server}=" | tr '[:lower:]' '[:upper:]' | sed 's/-/_/g')
  docKey=$(echo "SERVER_${server}_DOC=" | tr '[:lower:]' '[:upper:]' | sed 's/-/_/g')

  # find server env line. $envfile will override $envfileFallback
  for env in "${envs[@]}"; do
    # use SERVER_SERVERNAME if DOC_SERVERNAME empty
    if [[ $env =~ $serverKey ]] && [[ -z $docEnv ]]; then
      serverEnv=$env
    fi
    # use DOC_SERVERNAME generate doc first
    if [[ $env =~ $docKey ]]; then
      serverEnv=$env
      docEnv=$env
    fi
  done

  serverBranch=$(echo "$serverEnv" | cut -d "." -f 2)
  template="./packages/src/sdks-next/_template"
  apiDocServer="http://api-doc.dev.seiue.com"
  fileName="openapi-3.1.json"
  in="./packages/src/sdks-next/$server/doc.json"
  out="./packages/src/sdks-next/$server"

  # recreate target folder
  if [ -d "$out" ]; then rm -Rf $out; fi
  mkdir $out

  # 按目前的规则，如果 host 用 . 分割的第二个字符为 seiue 或 ci，则表示用后端 master 分支生成，如下：
  # http://platform.ci.seiue.com: master
  # https://platform.seiue.com: master
  # http://platform.backend-branch.ci.seiue.com: backend-branch
  if [[ $serverBranch == "seiue" ]] || [[ $serverBranch == "ci" ]]
  then
    docUrl=$apiDocServer/$server/$fileName
  else
    docUrl=$apiDocServer/$server/$serverBranch/$fileName
  fi
  info "Downloading $docUrl"
  curl $docUrl --silent > $in

  # generate sdk
  node ./packages/src/sdks-next/generator $in $out || exit 1

  # prettier
  prettier --write "$out/**/*" --loglevel silent

  success "Generated $server/$serverBranch SDK"
done
