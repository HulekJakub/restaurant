import { Injectable } from '@angular/core';
import { Dish, DishFilter, Rating, Order, History } from './datatypes';
import { DishService } from '../services/dish.service';
import { firstValueFrom, forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { RatingService } from '../services/rating.service';
import { HistoryService } from '../services/history.service';

interface Store {
  dishes: Dish[];
  ratings: Rating[];
  dishFilter?: DishFilter;
  order: Order[];
  history: History[];
}

interface StoreStream {
  dishes: ReplaySubject<Dish[]>;
  ratings: ReplaySubject<Rating[]>;
  dishFilter: ReplaySubject<DishFilter | undefined>;
  order: ReplaySubject<Order[]>;
  history: ReplaySubject<History[]>;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(
    private dishService: DishService,
    private ratingService: RatingService,
    private historyService: HistoryService
  ) {
    this.initializeStore();
  }

  public currency = 'EUR';
  private static initialized = false;
  private static store: Store = {
    dishes: [],
    ratings: [],
    dishFilter: undefined,
    order: [],
    history: [],
  };
  private static storeStream: StoreStream = {
    dishes: new ReplaySubject<Dish[]>(1),
    ratings: new ReplaySubject<Rating[]>(1),
    dishFilter: new ReplaySubject<DishFilter | undefined>(1),
    order: new ReplaySubject<Order[]>(1),
    history: new ReplaySubject<History[]>(1),
  };

  initializeStore() {
    if(StoreService.initialized){
      return;
    }
    StoreService.initialized = true;
    this.updateStoreDishes();
    this.updateStoreRatings();
    this.updateStoreHistory();
    StoreService.storeStream.dishFilter.next({} as DishFilter);
    StoreService.storeStream.order.next([]);
  }

  cuisines: string[] = [
    'polish',
    'international',
    'asian',
    'japanese',
    'italian',
    'french',
    'russian',
  ];
  categories: string[] = ['vegan', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack'];
  ratingGrades: number = 5;

  updateOrder(dishId: number, newAmount: number) {
    StoreService.store.order = StoreService.store.order.filter(
      (Order) => Order.dishId !== dishId
    );
    const dish = StoreService.store.dishes.find(d => d.id === dishId)!;
    if (newAmount !== 0) {
      StoreService.store.order.push({
          dishId: dishId,
          amount: newAmount,
          price: dish.price,
          name: dish.name,
        } as Order);
    }
    StoreService.storeStream.order.next(StoreService.store.order);
  }

  getStream(field: "dishes" | "ratings" | "dishFilter" | "order" | "history"): Observable<any> {
    return StoreService.storeStream[field];
  }

  setDishFilter(newFilter: DishFilter | undefined) {
    StoreService.store.dishFilter = newFilter;
    StoreService.storeStream.dishFilter.next(newFilter);
  }

  updateStoreHistory() {
    this.historyService.getHistories().subscribe((histories: History[]) => {
      StoreService.store.history = histories;
      StoreService.storeStream.history.next(histories);
    });
  }

  buyAllAndUpdateHistoryAndDishes() {
    const order = StoreService.store.order;
    if(order.length === 0) {
      return;
    }
    this.historyService
      .postHistory({ date: new Date(), dishes: order } as History)
      .subscribe((history) => {
        StoreService.store.history.push(history);
        StoreService.storeStream.history.next(StoreService.store.history);
        StoreService.store.order = []
        StoreService.storeStream.order.next(StoreService.store.order);

        this.updateDishesAvailableAmount(order);
      });
  }

  buyAndUpdateHistoryAndDishes(index: number) {
    const order = [StoreService.store.order[index]];
    this.historyService
      .postHistory({ date: new Date(), dishes: order } as History)
      .subscribe((history) => {
        StoreService.store.history.push(history);
        StoreService.storeStream.history.next(StoreService.store.history);
        StoreService.store.order = StoreService.store.order.filter((_, i) => i !== index);
        StoreService.storeStream.order.next(StoreService.store.order);

        this.updateDishesAvailableAmount(order);
      });
  }

  updateDishesAvailableAmount(order: Order[]) {
    forkJoin(
      order.map((r) =>
        this.dishService.patchDish(r.dishId, {
          available:
            StoreService.store.dishes.find((d) => d.id === r.dishId)!.available -
            r.amount
        })
      )
    ).subscribe((dishes) => {
      dishes.forEach(dish => {
        StoreService.store.dishes = StoreService.store.dishes.filter(d => d.id !== dish.id)
        StoreService.store.dishes.push(dish)
      });
      StoreService.storeStream.dishes.next(StoreService.store.dishes);
    });
  }

  updateStoreDishes() {
    this.dishService.getDishes().subscribe((data) => {
      StoreService.store.dishes = data;
      StoreService.storeStream.dishes.next(data);
    });
  }

  addDish(dish: Dish): Promise<any> {
    const temp = new Subject();
    this.dishService.postDish(dish).subscribe((saved) => {
      StoreService.store.dishes.push(saved);
      StoreService.storeStream.dishes.next(StoreService.store.dishes);
      temp.next(true);
    });
    return firstValueFrom(temp);
  }

  deleteDish(id: number) {
    this.dishService.deleteDish(id).subscribe(() => {
      StoreService.store.dishes = StoreService.store.dishes.filter((dish) => dish.id !== id);
      StoreService.storeStream.dishes.next(StoreService.store.dishes);
    });
  }


  updateStoreRatings() {
    this.ratingService.getRatings().subscribe((data: Rating[]) => {
      StoreService.store.ratings = data;
      StoreService.storeStream.ratings.next(data);
    });
  }

  addRating(rating: Rating) {
    this.ratingService.postRating(rating).subscribe((saved) => {
      StoreService.store.ratings.push(rating);
      StoreService.storeStream.ratings.next(StoreService.store.ratings);
    });
  }

}
