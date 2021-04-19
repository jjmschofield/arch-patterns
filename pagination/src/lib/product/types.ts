export interface Product {
  id: string;
  name: string;
  color: string;
  material: string;
  price: number;
  cursor: string;
}

export interface ProductRecord extends Product {
  createdAt: Date;
  updatedAt: Date;
}
