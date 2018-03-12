CREATE TABLE Category (
    "id" serial NOT NULL,
    categoryname varchar(8000),
    description varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE Customer (
    "id" varchar(8000) NOT NULL,
    companyname varchar(8000),
    contactname varchar(8000),
    contacttitle varchar(8000),
    address varchar(8000),
    city varchar(8000),
    region varchar(8000),
    postalcode varchar(8000),
    country varchar(8000),
    phone varchar(8000),
    fax varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE CustomerCustomerDemo (
    "id" varchar(8000) NOT NULL,
    customertypeid varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE CustomerDemographic (
    "id" varchar(8000) NOT NULL,
    customerdesc varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE Employee (
    "id" serial NOT NULL,
    lastname varchar(8000),
    firstname varchar(8000),
    title varchar(8000),
    titleofcourtesy varchar(8000),
    birthdate varchar(8000),
    hiredate varchar(8000),
    address varchar(8000),
    city varchar(8000),
    region varchar(8000),
    postalcode varchar(8000),
    country varchar(8000),
    homephone varchar(8000),
    ext varchar(8000),
    photo bytea,
    notes varchar(8000),
    reportsto int4,
    photopath varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE EmployeeTerritory (
    "id" varchar(8000) NOT NULL,
    employeeid int4 NOT NULL,
    territoryid varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE CustomerOrder (
    "id" serial NOT NULL,
    customerid varchar(8000),
    employeeid int4 NOT NULL,
    orderdate varchar(8000),
    requireddate varchar(8000),
    shippeddate varchar(8000),
    shipvia int4,
    freight numeric NOT NULL,
    shipname varchar(8000),
    shipaddress varchar(8000),
    shipcity varchar(8000),
    shipregion varchar(8000),
    shippostalcode varchar(8000),
    shipcountry varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE OrderDetail (
    "id" varchar(8000) NOT NULL,
    orderid int4 NOT NULL,
    productid int4 NOT NULL,
    unitprice numeric NOT NULL,
    quantity int4 NOT NULL,
    discount float8 NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE Product (
    "id" serial NOT NULL,
    productname varchar(8000),
    supplierid int4 NOT NULL,
    categoryid int4 NOT NULL,
    quantityperunit varchar(8000),
    unitprice numeric NOT NULL,
    unitsinstock int4 NOT NULL,
    unitsonorder int4 NOT NULL,
    reorderlevel int4 NOT NULL,
    discontinued int4 NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE Region (
    "id" serial NOT NULL,
    regiondescription varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE Shipper (
    "id" serial NOT NULL,
    companyname varchar(8000),
    phone varchar(8000),
    PRIMARY KEY ("id")
);

CREATE TABLE Supplier (
    "id" serial NOT NULL,
    companyname varchar(8000),
    contactname varchar(8000),
    contacttitle varchar(8000),
    address varchar(8000),
    city varchar(8000),
    region varchar(8000),
    postalcode varchar(8000),
    country varchar(8000),
    phone varchar(8000),
    fax varchar(8000),
    homepage varchar(8000),
    PRIMARY KEY ("id")
);


ALTER SEQUENCE product_id_seq RESTART WITH 80;