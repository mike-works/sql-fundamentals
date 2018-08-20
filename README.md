<p align='center'>
  <a href="https://mike.works" target='_blank'>
    <img height=40 src='https://assets.mike.works/img/login_logo-33a9e523d451fb0d902f73d5452d4a0b.png' />
  </a> 
</p>
<p align='center'>
  <a href="https://mike.works/course/sql-fundamentals-ad811af" target='_blank'>
    <img height=150 src='https://user-images.githubusercontent.com/558005/33009968-b8a0ea60-cd7c-11e7-81af-b48a6273b12b.png' />
  </a>
</p>
<p align='center'>
  <a href="https://mike.works/course/professional-sql-c9c7184" target='_blank'>
    <img height=150 src='https://user-images.githubusercontent.com/558005/38008070-40db7658-3212-11e8-879e-7efcf767777e.png' />
  </a>
</p>
<p align='center'>
 
  <a href="https://travis-ci.org/mike-works/sql-fundamentals?branch=solutions-pro" title="Build Status">
    <img title="Build Status" src="https://travis-ci.org/mike-works/sql-fundamentals.svg?branch=solutions-pro"/>
  </a>
   <a href="https://github.com/mike-works/sql-fundamentals/releases" title="Version">
    <img title="Version" src="https://img.shields.io/github/tag/mike-works/sql-fundamentals.svg" />
  </a>
</p>
<p align='center'>
This is the example project used for the <a title="Mike.Works" href="https://mike.works">Mike.Works</a> <a title="SQL Fundamentals" href="https://mike.works/course/sql-fundamentals-ad811af">SQL Fundamentals</a> and <a title="Professional SQL" href="https://mike.works/course/professional-sql-c9c7184">Professional SQL</a> courses.
</p>

# Course outline and slides

- [View course outline here](https://mike.works/course/sql-fundamentals-ad811af)
- [View slides here](https://docs.mike.works/sql-slides)

# What are we building?

We'll be working with several flavors of the [Northwind Database](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/sql/linq/downloading-sample-databases), which Microsoft uses to demonstrate a wide range of features across their MS Access and MS SQL Server product lines. You'll be writing some application code in a small [Node.js](https://nodejs.org) web application (built with [Express](https://expressjs.com)) to view and make changes to this data.

Here's what it looks like (and [here](https://damp-oasis-38940.herokuapp.com/) is a live demo):

<p align="center">
<img height=400 src="https://user-images.githubusercontent.com/558005/35312473-7646b68c-0070-11e8-83df-25800047b763.png" />
</p>

This app is not in a good state at the beginning of the workshop. Features are missing, there are major performances, and quite a few database-related bugs. We'll fix all these problems and learn as we go!

# Setup Instructions

## Clone this project

In your terminal, run

```sh
git clone https://github.com/mike-works/sql-fundamentals sql
cd sql
```

## Database Software Setup

This project is used for two workshops. [SQL Fundamentals](https://mike.works/course/sql-fundamentals-ad811af) may be completed using either [SQLite](https://www.sqlite.org/index.html), [MySQL](https://www.mysql.com/) or [PostgreSQL](https://www.postgresql.org/), and [Professional SQL](https://mike.works/course/professional-sql-c9c7184) requires either MySQL or PostgreSQL.

To set up the database software, please check out these guides

- [Installing SQLite 3](./SQLITE_SETUP.md)
- [Installing Postgres 10](./POSTGRES_SETUP.md)
- [Installing MySQL 5.7](./MYSQL_SETUP.md)

## Install node dependencies

If you only intend to complete the [SQL Fundamentals](https://mike.works/course/sql-fundamentals-ad811af) workshop (exercises 1-10), and wish to ONLY use SQLite, you can run

```sh
npm install --no-optional
```

If you wish to use MySQL or PostgreSQL, or proceed beyond exercise 10 for the [Professional SQL](https://mike.works/course/professional-sql-c9c7184) course, please include optional dependencies

```sh
npm install
```

## Database Initialization

#### SQLite

The `./master.sqlite` file already contains the data we'll be working with, but we'll want to create a copy called `./dev.sqlite` in case we mess up and have to reset to a known good state. To create this working copy, please run

```sh
npm run db:setup:sqlite
```

<details>
  <summary>What does this do?</summary>
  Ultimately, the command runs <a href="./scripts/db/setup/sqlite.sh">this script</a>
</details>

Validate that your SQLite database works by running

```sh
sqlite3 dev.sqlite "SELECT count(id) FROM Employee"
#> 9
```

#### PostgreSQL

The `./sql/northwind.pg.sql` script contains the necessary commands for setting up the PostgreSQL schema, and the `./sql/northwind_data.sql` file will fill the database with data. The database setup that includes database creation, running these scripts, and setting appropriate permissions can be run by executing this command

```sh
npm run db:setup:pg
```

<details>
  <summary>What does this do?</summary>
  Ultimately, the command runs <a href="./scripts/db/setup/pg.sh">this script</a>
</details>

Validate that your PostgreSQL database works by running

```sh
psql northwind -c "SELECT count(id) FROM Employee"
#>  count
#> -------
#>      9
#> (1 row)
```

#### MySQL

The `./sql/northwind.mysql.sql` script contains the necessary commands for setting up the MySQL schema, and the `./sql/northwind_data.sql` file will fill the database with data. The database setup that includes database creation, running these scripts, and setting appropriate permissions can be run by executing this command

```sh
npm run db:setup:mysql
```

<details>
  <summary>What does this do?</summary>
  Ultimately, the command runs <a href="./scripts/db/setup/mysql.sh">this script</a>
</details>

Validate that your MySQL database works by running

```sh
mysql -D northwind -e "SELECT count(id) FROM Employee"
#> +-----------+
#> | count(id) |
#> +-----------+
#> |         9 |
#> +-----------+
```

## Run the tests

There's an initial set of tests that ensure the app is correctly setup for the beginning of the course. You should be able to run this command and see them all passing

```sh
# Test against SQLite
npm run test --- EX00
# Test against PostgreSQL
DB_TYPE=pg npm run test --- EX00
```

# Commands & Scripts

## Starting the app

The app can be built and started up by running

```sh
npm run watch
```

This will shutdown, rebuild and restart the app whenever source files are changed. If you want to start the app so that a debugger may be connected, run

```sh
npm run watch:debug
```

## Running Tests

You may run a subset of test suites whotes names match a string by running

```sh
npm run test --- <string>
```

or if you wish for the tests to re-run on code changes

```sh
npm run test:watch --- <string>
```

and if you want to connect a debugger...

```sh
npm run test --- EX00 --inspect-brk
```

Additionally, you can run tests for a particular exercise, and all exercises before it. This is useful when trying to ensure that an exercise can be completed without breaking previous work.

```sh
npm run test:ex 4 # run tests up through exercise 4
```

or, if you want to re-run tests on code changes

```sh
npm run test:ex:watch 4
```

## Choosing a database

This project is designed to work with three databases: SQLite (default), PostgreSQL and MySQL. The database that's used is determined by the `DB_TYPE` environment variable

| DB_TYPE value | Database   |
| ------------- | ---------- |
| `pg`          | PostgreSQL |
| `mysql`       | MySQL      |
| anything else | SQLite     |

This environment variable can be used when running or testing the app. For example

```sh
DB_TYPE=mysql npm run watch # Run the app using MySQL, and rebuild whenever source code changes

DB_TYPE=pg npm run test:ex 9 # Run tests up to and including exercise 9 using PostgreSQL
```

# Recommended Tools

The following tools are recommended for this course. Depending on which database(s) you choose to use for the course, please download the appropriate tools by following their respective installation instructions.

- _All Databases_

  - [Visual Studio Code](https://code.visualstudio.com) - A fantastic code editor that we'll be using for its static analysis features and a few SQL-specific extensions
  - VS Code Extensions
    - [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) - to hilight urgent comments more prominently
    - [SQL Tools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) - to connect to databases and run queries right from within our code editor
    - [vscode-sql-template-literal](https://marketplace.visualstudio.com/items?itemName=forbeslindesay.vscode-sql-template-literal) - for syntax hilighting of tagged template literals in our JavaScript code.
    - [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) - type-checking and other static analysis on our code

- _MySQL_
  - [Sequel Pro](https://www.sequelpro.com/) (OS X only)
  - [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (OS X, Windows, Linux)
  - [VSCode MySQL Syntax](https://marketplace.visualstudio.com/items?itemName=jakebathman.mysql-syntax) - syntax hilighting for MySQL-specific syntax
- _PostgreSQL_
  - [pgAdmin](https://www.pgadmin.org/download/) (OS X, Windows, Linux)
  - [vscode-postgresql](https://marketplace.visualstudio.com/items?itemName=JPTarquino.postgresql) - for autocomplete and syntax hilighting of Postgres-specific SQL
- _SQLite_
  - [DB Browser for SQLite](http://sqlitebrowser.org/) (OS X, Windows, Linux)

# How To Deploy on Heroku

If for some reason, you cannot set up your own local database software, you can deploy this app onto heroku and use their $7/month hosted [PostgreSQL](https://www.postgresql.org) service.

### Step 1

Click this button to deploy the app to heroku. Because the database is large (about 700K rows) it cannot be run with their free database option.
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

### Step 2

Populate the database with data. This can be done one of two ways

#### If you have a local database already setup and running

Use the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) posgtres push utility (recommended)

```sh
heroku pg:push northwind DATABASE_URL --app replace-this-with-your-heroku-app-name
```

#### If you don't have a local database to push

Use the `psql` command line utility to run the huge PostgreSQL setup script. This will take at least several minutes.

```sh
heroku run "psql \$DATABASE_URL?ssl=true < northwind.sql -q" --app sql456
```

# Build Status

| Solutions Branch                                                                               | Status                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SQL Fundamentals](https://github.com/mike-works/sql-fundamentals/tree/solutions-fundamentals) | [![Build Status](https://travis-ci.org/mike-works/sql-fundamentals.svg?branch=solutions-fundamentals)](https://travis-ci.org/mike-works/sql-fundamentals?branch=solutions-fundamentals) |
| [SQL Pro](https://github.com/mike-works/sql-fundamentals/tree/solutions-pro)                   | [![Build Status](https://travis-ci.org/mike-works/sql-fundamentals.svg?branch=solutions-pro)](https://travis-ci.org/mike-works/sql-fundamentals?branch=solutions-pro)                   |

# License

While the general license for this project is the BSD 3-clause, the exercises
themselves are proprietary and are licensed on a per-individual basis, usually
as a result of purchasing a ticket to a public workshop, or being a participant
in a private training.

Here are some guidelines for things that are **OK** and **NOT OK**, based on our
understanding of how these licenses work:

### OK

- Using everything in this project other than the exercises (or accompanying tests)
  to build a project used for your own free or commercial training material
- Copying code from build scripts, configuration files, tests and development
  harnesses that are not part of the exercises specifically, for your own projects
- As an owner of an individual license, using code from tests, exercises, or
  exercise solutions for your own non-training-related project.

### NOT OK (without express written consent)

- Using this project, or any subset of
  exercises contained within this project to run your own workshops
- Writing a book that uses the code for these exercises
- Recording a screencast that contains one or more of this project's exercises

# Copyright

&copy; 2018 [Mike.Works](https://mike.works), All Rights Reserved

###### This material may not be used for workshops, training, or any other form of instructing or teaching developers, without express written consent
