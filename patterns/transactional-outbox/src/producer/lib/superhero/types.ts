export interface SuperHero {
  id: string,
  name: string
}

export interface SuperHeroRecord extends SuperHero {
  createdAt: Date,
  updatedAt: Date,
}
