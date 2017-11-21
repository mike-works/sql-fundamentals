interface DBRecord {
  Id: number|string;
}

interface Employee extends DBRecord {
  LastName: string;
  FirstName: string;
  Title: string;
  TitleOfCourtesy: string;
  BirthDate: string;
  HireDate: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  HomePhone: string;
  Extension: string;
  Notes: string;
  ReportsTo: number;
  PhotoPath: string;
}

interface Customer extends DBRecord {
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  Phone: string;
  Fax: string;
}

interface Supplier extends Customer {
  HomePage: string
}

interface Order extends DBRecord {
  CustomerId: string;
  EmployeeId: string;
  OrderDate: string;
  RequiredDate: string;
  ShippedDate: string;
}