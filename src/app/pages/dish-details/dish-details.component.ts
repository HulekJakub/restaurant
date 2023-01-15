import { Component, OnInit } from '@angular/core';
import { Dish, Order } from 'src/app/store/datatypes';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StoreService } from 'src/app/store/store.service';
import {
  Observable,
  Subscription,
  combineLatest,
  map,
} from 'rxjs';
import { DishRating, Rating } from 'src/app/store/datatypes';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css'],
})
export class DishDetailsComponent implements OnInit {
  public dishId: number;
  public dish: Dish;
  reservated$: Observable<number>;
  public dishId$: Observable<number>;
  public dishSub: Subscription;
  rating?: DishRating;
  ratings$: Observable<Rating[]>;

  constructor(private route: ActivatedRoute, public store: StoreService) {}

  ngOnInit() {
    this.dishId$ = this.route.paramMap.pipe(
      map((dishId$: ParamMap) => parseInt(dishId$.get('id') || '{}'))
    );

    this.dishSub = combineLatest([
      this.store.getStream('dishes'),
      this.dishId$,
    ]).pipe(
        map(([dishes, dishId]) =>
          dishes.filter((dish: Dish) => dish.id === dishId)
        ),
        map((dishes: Dish[]) => dishes[0])
      )
      .subscribe((dish) => {
        this.dish = dish;
      });

    this.ratings$ = combineLatest([
      this.store.getStream('ratings'),
      this.dishId$,
    ]).pipe(
      map(([ratings, dishId]) =>
        ratings.filter((rating: Rating) => rating.dishId === dishId)
      )
    );

    this.reservated$ = this.store
      .getStream('order')
      .pipe(
        map(
          (order: Order[]) =>
            order.find((r) => r.dishId === this.dish.id)?.amount ?? 0
        )
      );
  }

  ngOnDestroy() {
    this.dishSub?.unsubscribe();
  }

  public orderAmountChanged(event: number) {
    this.store.updateOrder(this.dish.id, event.valueOf());
  }
}
