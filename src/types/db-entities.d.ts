type DBRecordReference = number | string;

interface DBRecord {
  Id: DBRecordReference;
}

interface Category extends DBRecord {
  CategoryName: string;
  Description: string;
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
  OrderCount: number;
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
  OrderCount: number;
}

interface EmployeeTerritory extends DBRecord {
  EmployeeId: DBRecordReference;
  TerritoryId: DBRecordReference;
}

interface Order extends DBRecord {
  CustomerId: DBRecordReference;
  EmployeeId: DBRecordReference;
  ShipCity: string;
  ShipRegion: string;
  ShipPostalCode: string;
  OrderDate: string;
  RequiredDate: string;
  ShippedDate: string;
  SubtotalPrice: number;
}

interface OrderDetail extends DBRecord {
  OrderId: DBRecordReference;
  ProductId: DBRecordReference;
  UnitPrice: number;
  Quantity: number;
  Discount: number;
}

interface Product extends DBRecord {
  ProductName: string;
  SupplierId: DBRecordReference;
  CategoryId: DBRecordReference;
  QuantityPerUnit: number;
  UnitPrice: number;
  UnitsInStock: number;
  UnitsOnOrder: number;
  ReorderLevel: number;
  Discontinued: number;
}

interface Region extends DBRecord {
  RegionDescription: string;
}

interface Shipper extends DBRecord {
  CompanyName: string;
  Phone: string;
}

interface Supplier extends Customer {
  HomePage: string;
  ProductList: string;
}

interface Territory extends DBRecord {
  TerritoryDescription: string;
  RegionId: DBRecordReference;
}
