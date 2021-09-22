#!/bin/bash

source scripts/utils.sh

target=$1

if [ "$target" == "go:app" ]; then
  info "Building RC for iOS and Android..."
  cd apps/go/ios && bundle install && fastlane rc || exit 1
  cd ../android && bundle install && fastlane rc || exit 1
  exit 0
fi

if [ "$target" == "ios" ]; then
  info "Building RC for iOS..."
  cd apps/go/ios && bundle install && fastlane rc || exit 1
  exit 0
fi

if [ "$target" == "android" ]; then
  info "Building RC for Android..."
  cd apps/go/android && bundle install && fastlane rc || exit 1
  exit 0
fi

error "合法的 RC 目标为 go:app/ios/android"
exit 1


