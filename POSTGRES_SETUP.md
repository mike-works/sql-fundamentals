# Setting up PostgreSQL

## OS X

### Option 1 - Postgres.app w/ Homebrew

1.  First, make sure you have homebrew installed
2.  Run `brew doctor` and address anything homebrew wants you to fix
3.  Run `brew install postgresql`
4.  Download and run [Postgres.app](https://postgresapp.com/) -- a free-standing database server that's super easy to install and start. Grab [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-macos/) and install it.
5.  Grab [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-macos/) and install it.

### Option 2 - Homebrew Only

1.  First, make sure you have homebrew installed
2.  Run `brew doctor` and address anything homebrew wants you to fix
3.  Run `brew install postgresql`
4.  Run `brew services restart postgresql`
5.  Grab [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-macos/) and install it.

## Windows

1.  Grab the [the appropriate windows installer](https://www.postgresql.org/download/windows/) and run it.
2.  Put the DLLs in your `C:\WINDOWS\system32` folder
3.  Grab [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-macos/) and install it.

## Linux

Use `apt-get` or equivalent.
