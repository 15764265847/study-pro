#!/bin/bash

source scripts/utils.sh

# define our list of services
servers=("chalk" "apollo" "platform" "log" "vms" "chalk-data-seeder" "scms" "vnas" "sams")
results=()

envfile=$1

if [ -z "$envfile" ]; then
  info "env file default to env/.env.development.local"
  envfile=".env.development.local"
fi

envfilePath="env/$envfile"

if [ ! -f "$envfilePath" ]; then
  error "$envfilePathto : No such file."
  exit 1
fi

# read envfile into envs array
envs=()
while read -r line
do
  envs=( "${envs[@]}" "$line" )
done < "$envfilePath"

search=""

for server in "${servers[@]}"
do
  serverEnv=""
  serverKey=$(echo "SERVER_${server}=" | tr '[:lower:]' '[:upper:]' | sed 's/-/_/g')

  # find server env line
  for env in "${envs[@]}"; do
    if [[ $env =~ $serverKey ]]; then
      serverEnv=$env
      break
    fi
  done

  serverBranch=$(echo "$serverEnv" | cut -d "." -f 2)
  search="$search$server=$serverBranch&"
done

docUrl="http://apidoc.staging.seiue.com?$search"

success "opening apidoc: $docUrl"

open "$docUrl"
