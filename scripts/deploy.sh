#!/usr/bin/env bash

echo "Running npm install"
npm install
echo "Running pm2 stop brcris-nextjs"
pm2 stop brcris-nextjs
echo "npm run deploy"
npm run deploy
echo "finished!"