#!/bin/bash
set -e

echo "Installing yarn and pm2"
npm install -g yarn
npm install -g pm2
echo "Running yarn install"
yarn 
echo "Running pm2 stop brcris-nextjs"
pm2 stop brcris-nextjs
echo "copy env"
cp .env.example  .env
echo "yarn deploy"
yarn deploy
echo "finished!"