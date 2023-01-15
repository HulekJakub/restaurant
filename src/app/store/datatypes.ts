export interface Dish {
  id: number;
  name: string;
  cuisine: string;
  categories: string[];
  ingredients: string[];
  available: number;
  price: number;
  description: string;
  photos: string[];
}

export interface Rating {
  dishId: number;
  rating: number;
  nickname: string;
  review: string;
  orderDate: Date | null;
}

export interface DishFilter {
  name?: string;
  maxRating?: number;
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  cuisines: string[];
  categories: string[];
}

export interface DishRating {
  dishId: number;
  rating: number;
  numberOfRatings: number;
}

export interface Order{
  dishId: number;
  name: string;
  amount: number;
  price: number;
}

export interface History {
  id: number;
  date: Date;
  dishes: Order[];
}