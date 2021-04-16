export interface Person {
  id: string;
  name: string;
}

export interface PersonRecord extends Person {
  createdAt: Date;
  updatedAt: Date;
}
