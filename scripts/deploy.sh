#!/bin/bash
set -e

echo "Running yarn install"
yarn 
echo "Running pm2 stop brcris-nextjs"
# pm2 stop brcris-nextjs
echo "copy env"
cp .env.example  .env
echo "yarn deploy"
yarn deploy
echo "finished!"