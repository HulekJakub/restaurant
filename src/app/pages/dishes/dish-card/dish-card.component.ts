import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Dish, DishOrder } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';
import { Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.css'],
})
export class DishCardComponent implements OnInit, OnDestroy {
  rating: number | null = null;

  @Input() dish: Dish;
  @Input() isMostExpensive: boolean = false;
  @Input() isCheapest: boolean = false;

  reservated?: Observable<number>;

  userRolesSubscription: Subscription;
  userRoles: string[] = [];

  constructor(public store: StoreService, private router: Router) {}

  ngOnInit() {
    this.reservated = this.store
      .getStream('order')
      .pipe(
        map(
          (orders: DishOrder[]) =>
            orders.find((order) => order.dishId === this.dish.id)?.amount ?? 0
        )
      );

    this.userRolesSubscription = this.store
      .getStream('userRoles')
      .subscribe((roles) => {
        this.userRoles = roles;
      });
  }

  ngOnDestroy() {
    this.userRolesSubscription.unsubscribe();
  }


  public onClick(dish: Dish) {
    if(!this.userRoles) {
     this.router.navigate(['/login']);
     return;
    }
    this.router.navigate(['/dish', dish.id]);
  }
}
