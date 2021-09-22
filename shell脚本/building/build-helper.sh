#!/bin/bash
# cra build 失败并不会 return false，所以手动检测文本来确定编译是否失败
# see more at https://github.com/timarney/react-app-rewired/issues/493

target=$*
output=$($target)

echo "$output"

if [[ $output == *"Failed to compile"* ]]; then
  exit 1
fi