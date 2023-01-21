import { Injectable } from '@angular/core';
import {
  Dish,
  DishFilter,
  Rating,
  UserData,
  HistoryOrder,
  DishOrder,
  LoginData,
  User,
} from './datatypes';
import { DishService } from '../services/dish.service';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';
import { RatingService } from '../services/rating.service';
import { UserService } from '../services/user.service';
import { HttpResponse } from '@angular/common/http';

interface Store {
  dishes: Dish[];
  ratings: Rating[];
  dishFilter?: DishFilter;
  history: HistoryOrder[];
  order: DishOrder[];
  email: string;
  userLogged: boolean | undefined;
  userRoles: string[];
  userId: number | undefined;
  userBanned: boolean;
}

interface StoreStream {
  dishes: ReplaySubject<Dish[]>;
  ratings: ReplaySubject<Rating[]>;
  dishFilter: ReplaySubject<DishFilter | undefined>;
  order: ReplaySubject<DishOrder[]>;
  history: ReplaySubject<HistoryOrder[]>;
  email: ReplaySubject<string>;
  userLogged: ReplaySubject<boolean | undefined>;
  userRoles: ReplaySubject<string[]>;
  userId: ReplaySubject<number | undefined>;
  userBanned: ReplaySubject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(
    private dishService: DishService,
    private ratingService: RatingService,
    private userService: UserService
  ) {
    this.initializeStore();
  }

  public currency = 'EUR';
  public static tokenName = 'restaurantToken';
  public static refreshTokenName = 'restaurantRefreshToken';
  private static initialized = false;
  private static store: Store = {
    dishes: [],
    ratings: [],
    dishFilter: undefined,
    order: [],
    history: [],
    email: '',
    userLogged: undefined,
    userRoles: [],
    userId: undefined,
    userBanned: false,
  };
  private static storeStream: StoreStream = {
    dishes: new ReplaySubject<Dish[]>(1),
    ratings: new ReplaySubject<Rating[]>(1),
    dishFilter: new ReplaySubject<DishFilter | undefined>(1),
    order: new ReplaySubject<DishOrder[]>(1),
    history: new ReplaySubject<HistoryOrder[]>(1),
    email: new ReplaySubject<string>(1),
    userLogged: new ReplaySubject<boolean | undefined>(1),
    userRoles: new ReplaySubject<string[]>(1),
    userId: new ReplaySubject<number | undefined>(1),
    userBanned: new ReplaySubject<boolean>(1),
  };

  async initializeStore() {
    if (StoreService.initialized) {
      return;
    }
    StoreService.initialized = true;
    this.updateStoreDishes();
    this.updateStoreRatings();
    StoreService.storeStream.dishFilter.next({} as DishFilter);
    StoreService.storeStream.order.next([]);
    StoreService.storeStream.history.next([]);
    await this.updateLocalUser();
    this.updateUserRoles();
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
  categories: string[] = [
    'vegan',
    'breakfast',
    'lunch',
    'dinner',
    'dessert',
    'snack',
  ];
  ratingGrades: number = 5;
  public possibleRoles = ['ADMIN', 'MANAGER', 'USER'];

  getStream(field: keyof StoreStream): Observable<any> {
    return StoreService.storeStream[field];
  }

  updateOrder(dishId: number, newAmount: number) {
    StoreService.store.order = StoreService.store.order.filter(
      (Order) => Order.dishId !== dishId
    );
    const dish = StoreService.store.dishes.find((d) => d.id === dishId)!;
    if (newAmount !== 0) {
      StoreService.store.order.push({
        dishId: dishId,
        amount: newAmount,
        price: dish.price,
        name: dish.name,
      } as DishOrder);
    }
    StoreService.storeStream.order.next(StoreService.store.order);
    this.userService.updateOrder(StoreService.store.order).subscribe(() => {});
  }

  setDishFilter(newFilter: DishFilter | undefined) {
    StoreService.store.dishFilter = newFilter;
    StoreService.storeStream.dishFilter.next(newFilter);
  }

  putUsers(users: User[]): Promise<User[]> {
    return firstValueFrom(
      this.userService.putUsers(users).pipe(
        map((res: HttpResponse<User[]>) =>
          res.status === 200 ? res.body ?? [] : []
        ),
        catchError(() => of([]))
      )
    );
  }

  getAllUsers(): Promise<User[]> {
    return firstValueFrom(
      this.userService.getAllUsers().pipe(
        map((res: HttpResponse<User[]>) =>
          res.status === 200 ? res.body ?? [] : []
        ),
        catchError(() => of([]))
      )
    );
  }

  isUserLogged() {
    return StoreService.store.userLogged;
  }

  register(user: LoginData): Observable<boolean> {
    return this.userService.registerUser(user);
  }

  login(user: LoginData): Observable<boolean> {
    return this.userService.loginUser(user).pipe(
      tap(
        async (res: HttpResponse<{ token: string; refreshToken: string }>) => {
          localStorage.setItem(StoreService.tokenName, res.body?.token ?? '');
          localStorage.setItem(
            StoreService.refreshTokenName,
            res.body?.refreshToken ?? ''
          );
          await this.updateLocalUser();
          this.updateUserData();
          this.updateUserRoles();
        }
      ),
      map((res: HttpResponse<{ token: string }>) => res.status == 200),
      catchError(() => of(false))
    );
  }

  updateUserData() {
    this.userService
      .getUserData()
      .pipe(
        map((res: HttpResponse<UserData>) => res.body ?? undefined),
        catchError(() => of(undefined))
      )
      .subscribe((data?: UserData) => {
        if (data === undefined) {
          return;
        }
        const banned = data.banned ?? false;
        StoreService.store.userBanned = banned;
        StoreService.storeStream.userBanned.next(banned);
        const userId = data.id ?? undefined;
        StoreService.store.userId = userId;
        StoreService.storeStream.userId.next(userId);
        const history = data.history ?? [];
        StoreService.store.history = history;
        StoreService.storeStream.history.next(history);
        const order = data.order ?? [];
        StoreService.store.order = order;
        StoreService.storeStream.order.next(order);
        const email = data.email ?? '';
        StoreService.store.email = email;
        StoreService.storeStream.email.next(email);
      });
  }

  async logout() {
    localStorage.removeItem(StoreService.tokenName);
    localStorage.removeItem(StoreService.refreshTokenName);
    await this.updateLocalUser();
    this.updateUserRoles();
    this.updateUserData();
  }

  async updateLocalUser() {
    const token = localStorage.getItem(StoreService.tokenName);
    const tokenExists = !!token && token != '';
    let userLogged = false;
    if (!tokenExists) {
      userLogged = false;
    } else {
      userLogged = await firstValueFrom(
        this.userService.checkToken().pipe(
          map((res: HttpResponse<boolean>) =>
            res.status === 200 ? res.body! : false
          ),
          catchError(() => of(false))
        )
      );
    }
    if (userLogged) {
      this.updateUserRoles();
      this.updateUserData();
    }
    StoreService.store.userLogged = userLogged;
    StoreService.storeStream.userLogged.next(StoreService.store.userLogged);
  }

  updateUserRoles() {
    if (!StoreService.store.userLogged) {
      StoreService.store.userRoles = [];
      StoreService.storeStream.userRoles.next(StoreService.store.userRoles);
      return;
    }
    this.userService
      .getUserRoles()
      .pipe(
        map((res: HttpResponse<string[]>) =>
          res.status === 200 ? res.body! : []
        ),
        catchError(() => of([]))
      )
      .subscribe((roles: string[]) => {
        StoreService.store.userRoles = roles;
        StoreService.storeStream.userRoles.next(StoreService.store.userRoles);
      });
  }

  buyAllAndUpdateHistoryAndDishes() {
    const order = StoreService.store.order;
    if (order.length === 0) {
      return;
    }
    this.userService
      .addOrderToHistory({ date: new Date(), orders: order } as HistoryOrder)
      .pipe(
        map((res: HttpResponse<HistoryOrder[]>) =>
          res.status === 200 ? res : null
        ),
        catchError(() => of(null))
      )
      .subscribe((res: null | HttpResponse<HistoryOrder[]>) => {
        if (!res) {
          return;
        }

        StoreService.store.history = res.body!;
        StoreService.storeStream.history.next(StoreService.store.history);
        StoreService.store.order = [];
        StoreService.storeStream.order.next(StoreService.store.order);

        this.updateStoreDishes();
      });
  }

  buyAndUpdateHistoryAndDishes(index: number) {
    const order = [StoreService.store.order[index]];

    this.userService
      .addOrderToHistory({ date: new Date(), orders: order } as HistoryOrder)
      .pipe(
        map((res: HttpResponse<HistoryOrder[]>) =>
          res.status === 200 ? res : null
        ),
        catchError(() => of(null))
      )
      .subscribe((res: null | HttpResponse<HistoryOrder[]>) => {
        if (!res) {
          return;
        }

        StoreService.store.history = res.body!;
        StoreService.storeStream.history.next(StoreService.store.history);
        StoreService.store.order = StoreService.store.order.filter(
          (_, i) => i !== index
        );
        StoreService.storeStream.order.next(StoreService.store.order);
        this.updateStoreDishes();
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

  updateDish(id: number, dishUpdate: Partial<Dish>): Promise<any> {
    const temp = new Subject();
    this.dishService.patchDish(id, dishUpdate).subscribe((saved) => {
      StoreService.store.dishes.push(saved);
      StoreService.storeStream.dishes.next(StoreService.store.dishes);
      temp.next(true);
    });
    return firstValueFrom(temp);
  }

  deleteDish(id: number) {
    this.dishService.deleteDish(id).subscribe(() => {
      StoreService.store.dishes = StoreService.store.dishes.filter(
        (dish) => dish.id !== id
      );
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
