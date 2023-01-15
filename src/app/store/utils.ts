import { Dish, DishRating, Rating } from "./datatypes";

export function getDishesRatings(dishes: Dish[], ratings: Rating[]): DishRating[] {
    return dishes.map(x => getDishRating(x.id, ratings));
}

export function getDishRating(dishId: number, ratings: Rating[]): DishRating {
    const dishRatings = ratings
        .filter((rating: Rating) => rating.dishId == dishId)
        .map((x: Rating) => x.rating);
    
    const totalRating = dishRatings.reduce((sum, cur) => sum + cur, 0) / (dishRatings.length ? dishRatings.length : 1);    
    return { dishId: dishId, rating: totalRating, numberOfRatings: dishRatings.length};
}
