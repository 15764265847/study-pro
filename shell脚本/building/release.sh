#!/bin/bash

source scripts/utils.sh

target=$1

if [ "$target" = "go:app" ]; then
  info "Releasing iOS and Android..."

  generate_production_sdk

  cd apps/go/ios && bundle install && fastlane release || exit 1
  cd ../android && bundle install && fastlane release || exit 1
  exit 0
fi

if [ "$target" = "ios" ]; then
  info "Releasing iOS..."

  generate_production_sdk

  cd apps/go/ios && bundle install && fastlane release || exit 1
  exit 0
fi

if [ "$target" = "android" ]; then
  info "Releasing Android..."

  generate_production_sdk

  cd apps/go/android && bundle install && fastlane release || exit 1
  exit 0
fi

if [ "$target" = "web" ]; then
  info "Releasing web apps..."
  ./scripts/building/release-web.sh || exit 1
  exit 0
fi

error "合法的 release 目标为 app/ios/anroid/web"
exit 1


