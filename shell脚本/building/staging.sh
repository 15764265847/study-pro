#!/bin/bash

source scripts/utils.sh

target=$1

if [ "$target" == "" ]
then
  error "请指定 staging 目标：app/ios/anroid/chalk/apollo..."
  exit 1
fi

if [ "$target" == "go:app" ]; then
  info "Staging iOS and Android..."

  cd apps/go/ios && bundle install || exit 1
  if [ -z "${SKIP_PRECHECK}" ]; then
    fastlane staging || exit 1
  else
    fastlane staging skip_precheck:true || exit 1
  fi

  cd ../android && bundle install || exit 1
  if [ -z "${SKIP_PRECHECK}" ]; then
    fastlane staging || exit 1
  else
    fastlane staging skip_precheck:true || exit 1
  fi
  exit 0
fi

if [ "$target" == "ios" ]; then
  info "Staging iOS..."
  cd apps/go/ios && bundle install || exit 1
  if [ -z "${SKIP_PRECHECK}" ]; then
    fastlane staging || exit 1
  else
    fastlane staging skip_precheck:true || exit 1
  fi
  exit 0
fi

if [ "$target" == "android" ]; then
  info "Staging Android..."
  cd apps/go/android && bundle install || exit 1
  if [ -z "${SKIP_PRECHECK}" ]; then
    fastlane staging || exit 1
  else
    fastlane staging skip_precheck:true || exit 1
  fi
  exit 0
fi

./scripts/building/staging-web.sh $target


