import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dish, DishOrder, HistoryOrder } from 'src/app/store/datatypes';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StoreService } from 'src/app/store/store.service';
import { Observable, Subscription, combineLatest, map, filter } from 'rxjs';
import { DishRating, Rating } from 'src/app/store/datatypes';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css'],
})
export class DishDetailsComponent implements OnInit, OnDestroy {
  reservated$: Observable<number>;
  public dishId$: Observable<number>;
  public dishId: number;
  public dish: Dish;
  public dishSub: Subscription;
  rating?: DishRating;
  ratings$: Observable<Rating[]>;

  userReviewed?: boolean;
  userBought?: boolean;
  userBoughtSubscription: Subscription;
  userBanned: boolean;
  userBannedSubscription: Subscription;
      
  userRolesSubscription: Subscription;
  userRoles: string[] = [];

  constructor(private route: ActivatedRoute, public store: StoreService) {}

  ngOnInit() {
    this.dishId$ = this.route.paramMap.pipe(
      map((dishId$: ParamMap) => parseInt(dishId$.get('id') || '{}'))
    );

    this.dishSub = combineLatest([this.store.getStream('dishes'), this.dishId$])
      .pipe(
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
      this.store.getStream('userId').pipe(filter(userId => userId != undefined))
    ]).pipe(
      map(([ratings, dishId, userId]) =>
        { const filteredRatings = ratings.filter((rating: Rating) => rating.dishId === dishId)
          this.userReviewed = !!filteredRatings.find((rating: Rating) => rating.userId === userId)
          return filteredRatings;
        }
      )
    );

    this.reservated$ = this.store
      .getStream('order')
      .pipe(
        map(
          (order: DishOrder[]) =>
            order.find((r) => r.dishId === this.dish.id)?.amount ?? 0
        )
      );

    this.userBoughtSubscription = combineLatest([
      this.store.getStream('history'),
      this.dishId$,
    ])
      .pipe(
        map(([history, dishId]) => {
          return !!history.find((historyOrder: HistoryOrder) =>
            historyOrder.orders.find((order) => order.dishId === dishId)
          );
        })
      )
      .subscribe((bought) => {
        this.userBought = bought;
      });

    this.userBannedSubscription = this.store.getStream('userBanned').subscribe(banned => {
      this.userBanned = banned;
    })

    this.userRolesSubscription = this.store
    .getStream('userRoles')
    .subscribe((roles) => {
      this.userRoles = roles;
    });
  }

  ngOnDestroy() {
    this.dishSub?.unsubscribe();
    this.userBoughtSubscription.unsubscribe();
    this.userBannedSubscription.unsubscribe();
  }
}
