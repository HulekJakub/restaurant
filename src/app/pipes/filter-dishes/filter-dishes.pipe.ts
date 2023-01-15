import { Pipe, PipeTransform } from '@angular/core';
import { Dish, DishFilter, Rating } from '../../store/datatypes';
import { getDishRating } from '../../store/utils';

@Pipe({
  name: 'filterDishes',
})
export class FilterDishesPipe implements PipeTransform {
  transform(value: Dish[], filter?: DishFilter, ratings?: Rating[]): Dish[] {
    value = value.sort((d1, d2) => d1.available > d2.available ? -1: 1);

    if (!filter) {
      return value;
    }

    if (filter.name) {
      value = value.filter((dish) =>
        dish.name.toLowerCase().includes(filter.name!.toLowerCase())
      );
    }
    if (filter.categories && filter.categories.length > 0) {
      value = value.filter((dish) =>
        dish.categories.some((category) => filter.categories.includes(category))
      );
    }
    if (filter.cuisines && filter.cuisines.length > 0) {
      value = value.filter((dish) => filter.cuisines.includes(dish.cuisine));
    }
    if (filter.minPrice) {
      value = value.filter((dish) => dish.price >= filter.minPrice!);
    }
    if (filter.maxPrice) {
      value = value.filter((dish) => dish.price <= filter.maxPrice!);
    }
    
    if (!ratings) {
      return value;
    }

    if (filter.minRating) {
      value = value.filter(
        (dish) => getDishRating(dish.id, ratings).rating >= filter.minRating!
      );
    }
    if (filter.maxRating) {
      value = value.filter(
        (dish) => getDishRating(dish.id, ratings).rating <= filter.maxRating!
      );
    }

    return value;
  }
}
