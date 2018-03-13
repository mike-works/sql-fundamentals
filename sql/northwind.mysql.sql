ALTER DATABASE northwind
    DEFAULT CHARACTER SET utf8
    DEFAULT COLLATE utf8_unicode_ci;

CREATE TABLE Category (
    id integer PRIMARY KEY AUTO_INCREMENT,
    categoryname varchar(255),
    description varchar(255)
);

CREATE TABLE Customer (
    id varchar(8) PRIMARY KEY,
    companyname varchar(255),
    contactname varchar(255),
    contacttitle varchar(255),
    address varchar(255),
    city varchar(255),
    region varchar(255),
    postalcode varchar(255),
    country varchar(255),
    phone varchar(255),
    fax varchar(255)
);

CREATE TABLE CustomerCustomerDemo (
    id varchar(255) PRIMARY KEY,
    customertypeid varchar(255)
);

CREATE TABLE CustomerDemographic (
    id varchar(255) PRIMARY KEY,
    customerdesc varchar(255)
);

CREATE TABLE Employee (
    id integer PRIMARY KEY AUTO_INCREMENT,
    lastname varchar(255),
    firstname varchar(255),
    title varchar(255),
    titleofcourtesy varchar(255),
    birthdate varchar(255),
    hiredate varchar(255),
    address varchar(255),
    city varchar(255),
    region varchar(255),
    postalcode varchar(255),
    country varchar(255),
    homephone varchar(255),
    ext varchar(255),
    notes varchar(1024),
    reportsto integer
);

CREATE TABLE EmployeeTerritory (
    id varchar(255) PRIMARY KEY,
    employeeid integer NOT NULL,
    territoryid varchar(255)
);

CREATE TABLE CustomerOrder (
    id integer PRIMARY KEY AUTO_INCREMENT,
    customerid varchar(255),
    employeeid integer NOT NULL,
    orderdate varchar(255),
    requireddate varchar(255),
    shippeddate varchar(255),
    shipvia integer,
    freight numeric NOT NULL,
    shipname varchar(255),
    shipaddress varchar(255),
    shipcity varchar(255),
    shipregion varchar(255),
    shippostalcode varchar(255),
    shipcountry varchar(255)
);

CREATE TABLE OrderDetail (
    id varchar(255) PRIMARY KEY,
    orderid integer NOT NULL,
    productid integer NOT NULL,
    unitprice numeric NOT NULL,
    quantity integer NOT NULL,
    discount real NOT NULL
);

CREATE TABLE Product (
    id integer PRIMARY KEY AUTO_INCREMENT,
    productname varchar(255),
    supplierid integer NOT NULL,
    categoryid integer NOT NULL,
    quantityperunit varchar(255),
    unitprice numeric NOT NULL,
    unitsinstock integer NOT NULL,
    unitsonorder integer NOT NULL,
    reorderlevel integer NOT NULL,
    discontinued integer NOT NULL
);

CREATE TABLE Region (
    id integer PRIMARY KEY AUTO_INCREMENT,
    regiondescription varchar(255)
);

CREATE TABLE Shipper (
    id integer PRIMARY KEY AUTO_INCREMENT,
    companyname varchar(255),
    phone varchar(255)
);

CREATE TABLE Supplier (
    id integer PRIMARY KEY AUTO_INCREMENT,
    companyname varchar(255),
    contactname varchar(255),
    contacttitle varchar(255),
    address varchar(255),
    city varchar(255),
    region varchar(255),
    postalcode varchar(255),
    country varchar(255),
    phone varchar(255),
    fax varchar(255),
    homepage varchar(255)
);

