interface DBRecord {
  id: number | string;
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
  employeeid: number | string;
  territoryid: number | string;
}

interface Order extends DBRecord {
  customerid: number | string;
  employeeid: number | string;
  freight: number;
  orderdate: string;
  requireddate: string;
  shipaddress: string;
  shipcity: string;
  shipcountry: string;
  shipname: string;
  shippeddate: string;
  shippostalcode: string;
  shipregion: number | string;
  shipvia: number;
  subtotal: number;
}

interface OrderDetail extends DBRecord {
  orderid: number | string;
  productid: number | string;
  unitprice: number;
  quantity: number;
  discount: number;
}

interface Product extends DBRecord {
  productname: string;
  supplierid: number | string;
  categoryid: number | string;
  quantityperunit: string;
  unitprice: number;
  unitsinstock: number;
  unitsonorder: number;
  reorderlevel: number;
  discontinued: number;
  tags: string[];
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

interface ProductPriceInfo extends DBRecord {
  productid: number | string;
  changedate: string;
  fromprice: number;
  toprice: number;
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
  regionid: number | string;
}
