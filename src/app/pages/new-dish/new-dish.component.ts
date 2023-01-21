import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  combineLatest,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import { Dish } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-new-dish',
  templateUrl: './new-dish.component.html',
  styleUrls: ['./new-dish.component.css'],
})
export class NewDishComponent implements OnInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private store: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  myForm: FormGroup;
  cuisines: string[] = this.store.cuisines;
  categories: string[] = this.store.categories;

  dishId$: Observable<number>;
  dishId: number;
  dishSubscription: Subscription;
  dish?: Dish;

  dishChecked: boolean = false;

  async ngOnInit() {
    this.dishId$ = this.route.paramMap.pipe(
      map((params: ParamMap) => parseInt(params.get('id') || '-1'))
    );

    this.dishSubscription = combineLatest([
      this.dishId$,
      this.store.getStream('dishes'),
    ])
      .pipe(
        map(([dishId, dishes]) =>
          dishes.find((dish: Dish) => dish.id === dishId)
        )
      )
      .subscribe((dish: Dish) => {
        this.dish = dish;
        this.resetForm();
        this.dishChecked = true;
      });
  }

  ngOnDestroy() {
    this.dishSubscription.unsubscribe();
  }

  resetForm() {
    if (this.dish == undefined) {
      this.myForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        cuisine: ['', Validators.required],
        categories: [{ value: [], disabled: false }, [Validators.required]],
        ingredients: ['', Validators.required],
        available: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        price: [
          '',
          [Validators.required, Validators.pattern('^([0-9]*[.])?[0-9]+$')],
        ],
        photos: ['', Validators.required],
      });
      return;
    }
    this.myForm = this.formBuilder.group({
      name: [this.dish.name, Validators.required],
      description: [this.dish.description, Validators.required],
      cuisine: [this.dish.cuisine, Validators.required],
      categories: [
        { value: this.dish.categories, disabled: false },
        [Validators.required],
      ],
      ingredients: [this.join(this.dish.ingredients), Validators.required],
      available: [
        this.dish.available,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      price: [
        this.dish.price,
        [Validators.required, Validators.pattern('^([0-9]*[.])?[0-9]+$')],
      ],
      photos: [this.join(this.dish.photos), Validators.required],
    });
  }

  async onSubmit() {
    const newDish = {
      id: this.dish?.id ?? -1,
      name: this.myForm.value.name,
      description: this.myForm.value.description,
      cuisine: this.myForm.value.cuisine,
      categories: this.myForm.value.categories,
      ingredients: this.splitAndTrim(this.myForm.value.ingredients),
      available: parseInt(this.myForm.value.available),
      price: parseFloat(this.myForm.value.price),
      photos: this.splitAndTrim(this.myForm.value.photos),
    };
    if (newDish.id === -1) {
      await this.store.addDish(newDish);
    } else {
      await this.store.updateDish(newDish.id, newDish);
    }
    this.router.navigate([`manageDishes`]);
  }

  splitAndTrim(values: string): string[] {
    return values.split(',').map((val) => val.trim());
  }

  join(values: string[]): string {
    return values.join(',\n');
  }
}
