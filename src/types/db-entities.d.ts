type DBRecordReference = number | string;

interface DBRecord {
  id: DBRecordReference;
}

interface Category extends DBRecord {
  categoryname: string;
  description: string;
}

interface Customer extends DBRecord {
  companyname: string;
  contactname: string;
  contacttitle: string;
  address: string;
  city: string;
  region: string;
  postalcode: string;
  country: string;
  phone: string;
  fax: string;
  ordercount: number;
}

interface Employee extends DBRecord {
  lastname: string;
  firstname: string;
  title: string;
  titleofcourtesy: string;
  birthdate: string;
  hiredate: string;
  address: string;
  city: string;
  region: string;
  postalcode: string;
  country: string;
  homephone: string;
  extension: string;
  notes: string;
  reportsto: number;
  photopath: string;
  ordercount: number;
}

interface EmployeeTerritory extends DBRecord {
  employeeid: DBRecordReference;
  territoryid: DBRecordReference;
}

interface Order extends DBRecord {
  customerid: DBRecordReference;
  employeeid: DBRecordReference;
  freight: number;
  orderdate: string;
  requireddate: string;
  shipaddress: string;
  shipcity: string;
  shipcountry: string;
  shipname: string;
  shippeddate: string;
  shippostalcode: string;
  shipregion: string;
  shipvia: number;
  subtotalprice: number;
}

interface OrderDetail extends DBRecord {
  orderid: DBRecordReference;
  productid: DBRecordReference;
  unitprice: number;
  quantity: number;
  discount: number;
}

interface Product extends DBRecord {
  productname: string;
  supplierid: DBRecordReference;
  categoryid: DBRecordReference;
  quantityperunit: number;
  unitprice: number;
  unitsinstock: number;
  unitsonorder: number;
  reorderlevel: number;
  discontinued: number;
  metadata: {
    flavor: {
      salty: number;
      sweet: number;
      spicy: number;
      sour: number;
      bitter: number;
    };
  };
}

interface Region extends DBRecord {
  regiondescription: string;
}

interface Shipper extends DBRecord {
  companyname: string;
  phone: string;
}

interface Supplier extends Customer {
  homepage: string;
  productlist: string;
}

interface Territory extends DBRecord {
  territorydescription: string;
  regionid: DBRecordReference;
}
