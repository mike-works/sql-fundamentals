#!/usr/bin/env sh
echo "\033[0;32mSetting Up SQLite Database...\033[0m"
rm -f dev.sqlite
cp master.sqlite dev.sqlite