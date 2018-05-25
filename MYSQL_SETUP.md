# Setting up MySQL

## OS X

### Option 1 - Homebrew

1. First, make sure you have homebrew installed
2. Run `brew doctor` and address anything homebrew wants you to fix
3. Run `brew install mysql`
4. Run `brew services restart mysql`
5. Run `mysql.server start`
6. Run `mysql_secure_installation`

## Windows

1. Grab the [the appropriate windows installer](https://dev.mysql.com/downloads/windows/) and run it.

## Linux

Use `apt-get` or equivalent.


## All

Once you've installed mysql, you can test your installation with a user of your choice (we'll use the `root` user) by running
```sh
mysqlshow -uroot -p
```

Finally, you'll need to create a login config file with the database's master username and password. Replace `root` with the master user account for your database if necessary

```sh
mysql_config_editor set --login-path=local --host=localhost --user=root --password
```

You should now be able to run
```sh
mysqlshow --login-path=local
```
without having to provide a password in the CLI.
