#!/bin/sh

echo "DB Sync"
npx prisma db push --skip-generate
echo "Run app"
node build/app