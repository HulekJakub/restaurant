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
  userId: number;
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

export interface DishOrder{
  dishId: number;
  name: string;
  amount: number;
  price: number;
}

export interface HistoryOrder {
  date: Date;
  orders: DishOrder[];
}

export interface UserData {
  id: number,
  email: string;
  history: HistoryOrder[];
  order: DishOrder[];
  banned: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[]
  banned: boolean;
}
