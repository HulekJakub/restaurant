import { Pipe, PipeTransform } from '@angular/core';
import { Dish } from 'src/app/store/datatypes';

@Pipe({ name: 'pagination' })
export class PaginationPipe implements PipeTransform {
  transform(
    dishes: Dish[] | null,
    itemsPerPage: number,
    currentPage: number
  ): Dish[] | null {
    if (dishes == null || itemsPerPage <= 0 || itemsPerPage > dishes.length) {
      return dishes;
    }
    if (currentPage > dishes.length / itemsPerPage) {
      return dishes.slice(itemsPerPage * currentPage, dishes.length);
    }
    return dishes.slice(
      itemsPerPage * currentPage,
      itemsPerPage * (currentPage + 1)
    );
  }
}
