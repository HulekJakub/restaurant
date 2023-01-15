import { Component, Input, OnInit } from '@angular/core';
import { Dish, Order } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.css'],
})
export class DishCardComponent implements OnInit {
  rating: number | null = null;

  @Input() dish: Dish;
  @Input() isMostExpensive: boolean = false;
  @Input() isCheapest: boolean = false;

  reservated?: Observable<number>;
  constructor(public store: StoreService, private router: Router) {}

  public orderAmountChanged(event: number) {
    this.store.updateOrder(this.dish.id, event.valueOf());
  }

  ngOnInit() {
    this.reservated = this.store
      .getStream('order')
      .pipe(
        map(
          (orders: Order[]) =>
            orders.find((order) => order.dishId === this.dish.id)?.amount ?? 0
        )
      );
  }

  delete(event: Event) {
    event.stopPropagation();
    this.store.updateOrder(this.dish.id, 0);
    this.store.deleteDish(this.dish.id);
  }

  public onClick(dish: Dish) {
    this.router.navigate(['/menu', dish.id]);
  }
}
