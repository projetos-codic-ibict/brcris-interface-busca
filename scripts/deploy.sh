#!/usr/bin/env bash
set -e

echo "Running NPM install"
npm ci 
echo "Running pm2 stop brcris-nextjs"
pm2 stop brcris-nextjs
echo "copy env"
cp .env.example  .env
echo "NPM deploy"
npm run deploy
echo "finished!"