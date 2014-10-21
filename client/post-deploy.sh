#!/bin/sh
# This is sample deploy script
# You can run this on server after git push or
# locally before you put new version of website via FTP

echo "[Deploy] Running npm install"
npm install
if [ $? = "0" ]; then
  echo "[Deploy] Npm install success, running Bower install"
  bower install
  if [ $? = "0" ]; then
    echo "[Deploy] Bower install success, running build"
    rm -rf dist
    gulp --gulpfile gulpfile-production.js
    if [ $? = "0" ]; then
      echo "[Deploy] Build success, deploying files"
      rm -rf deploy
      mv dist deploy
    else
      echo "[Deploy] Build failed, aborting deploy"
    fi
  else
    echo "[Deploy] Bower install failed, aborting deploy"
  fi
else
  echo "[Deploy] Npm install failed, aborting deploy"
fi
