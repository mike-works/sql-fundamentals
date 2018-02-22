export default function entityUrl(entity: string, id: string) {
  switch (entity) {
    case 'employee':
      return `/employees/${id}`;
    case 'customer':
      return `/customers/${id}`;
    case 'supplier':
      return `/supplier/${id}`;
    case 'product':
      return `/product/${id}`;
    default:
      throw new Error(`No URL-building strategy for ${entity}`);
  }
}
