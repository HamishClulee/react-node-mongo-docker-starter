#!/usr/bin/env bash
set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "\n${GREEN}====================== DEPLOYING APP =========================== 🚀 ${NC}"

echo "\n${YELLOW}--> Building App... 🚀 ${NC}\n"

yarn app:build

echo "\n${YELLOW}--> Pushing to git... 🚀 ${NC}\n"

DATE=`date '+%Y-%m-%d %H:%M:%S'`
git add .
MSG="=> deployed: $DATE"
git commit -m "$1 $MSG"
git push

echo "\n${YELLOW}--> Doing containery things on droplet... 🚀 ${NC}\n"

ssh user@example.io 'cd /var/www/example && git pull && docker-compose build example && docker-compose up -d'

echo "\n${GREEN}==================== ALL DONE :) =============================== 🚀 ${NC}\n"
