# Setting up SQLite

## OS X

The easiest way to install SQLite on OS X is to use [homebrew](https://brew.sh/).

1. First, make sure you have homebrew installed
2. Run `brew doctor` and address anything homebrew wants you to fix
3. Run `brew install sqlite`

## Windows

1. Grab the [precompiled windows DLLs from the SQLite website](https://www.sqlite.org/download.html#win32). Make sure to also get the _sqlite-tools_ package so you have a CLI that can run in `cmd.exe`
2. Put the DLLs in your `C:\WINDOWS\system32` folder

## Linux

Please run

`sudo apt-get install sqlite3 libsqlite3-dev`

or the equivalent on your operating system
