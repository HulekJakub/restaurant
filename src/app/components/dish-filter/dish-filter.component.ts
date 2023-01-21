import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Dish, DishFilter } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-dish-filter',
  templateUrl: './dish-filter.component.html',
  styleUrls: ['./dish-filter.component.css'],
})
export class DishFilterComponent {
  constructor(private fb: FormBuilder, private store: StoreService) {}

  form: FormGroup;
  categories: string[] = this.store.categories;
  cuisines: string[] = this.store.cuisines;
  ratingGrades: number = this.store.ratingGrades;
  formValueSubscription: Subscription;
  pricesRangeSubscription: Subscription;

  maxPrice?: number = 100;
  minPrice?: number = 0;

  maxRating?: number = 5;
  minRating?: number = 0;

  categoriesArray(): FormArray {
    return this.form.controls['categories'] as FormArray;
  }

  cuisinesArray(): FormArray {
    return this.form.controls['categories'] as FormArray;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      cuisines: [{ value: [], disabled: false }, ],
      categories: [{ value: [], disabled: false }, ],
      minRating: '',
      maxRating: this.ratingGrades,
      minPrice: '',
      maxPrice: '',
    });

    this.pricesRangeSubscription = this.store.getStream('dishes')
      .subscribe((dishes: Dish[]) => {
        let newMaxPrice = dishes
          .map((dish: Dish) => dish.price)
          .reduce(
            (max: number, cur: number) => (max > cur ? max : cur),
            Number.MIN_VALUE
          );
        let newMinPrice = dishes
          .map((dish: Dish) => dish.price)
          .reduce(
            (max: number, cur: number) => (max < cur ? max : cur),
            Number.MAX_VALUE
          );
        this.minPrice = newMinPrice;
        this.maxPrice = newMaxPrice;
        this.form.controls['minPrice'].setValue(newMinPrice);
        this.form.controls['maxPrice'].setValue(newMaxPrice);
      });

    this.formValueSubscription = this.form.valueChanges.subscribe((value) => {
      this.store.setDishFilter(this.generateDishFilter(value));
    });

    this.store.setDishFilter(undefined);
  }

  ngOnDestroy() {
    this.formValueSubscription.unsubscribe();
    this.pricesRangeSubscription.unsubscribe();
  }

  generateDishFilter(value: any): DishFilter | undefined {
    const newFilter = {
      name: this.form.value.name.trim(),
      cuisines: this.form.value.cuisines,
      categories: this.form.value.categories,
      minRating: parseFloat(this.form.value.minRating),
      maxRating: parseFloat(this.form.value.maxRating),
      minPrice: parseFloat(this.form.value.minPrice),
      maxPrice: parseFloat(this.form.value.maxPrice),
    } as DishFilter;

    return newFilter;
  }
}
