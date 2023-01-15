import { Component, OnInit, OnDestroy } from '@angular/core';
import { History, Order } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';
import { map, Subscription } from 'rxjs';

export interface BasketEntry {
  name: string;
  price: number;
  amount: number;
}

export interface HistoryEntry {
  date: Date;
  names: string[];
  price: number;
}

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit, OnDestroy {
  constructor(protected store: StoreService) {}

  basket?: BasketEntry[];
  basketSubscription: Subscription;
  history?: HistoryEntry[];
  historySubscription: Subscription;

  ngOnInit() {
    this.basketSubscription = this.store.getStream('order').pipe(
      map(orders =>
        orders.map((order: Order) => {
          return {
            name: order.name,
            price: order.price,
            amount: order.amount,
          };
        })
      )
    ).subscribe(orders => {
      this.basket = orders;
    });

    this.historySubscription = this.store.getStream('history').pipe(
      map(histories =>
        histories.map((history: History) => {
          return {
            date: history.date,
            names: history.dishes.map((dish) => dish.name),
            price: history.dishes.reduce(
              (acc, cur) => acc + cur.price * cur.amount,
              0
            ),
          };
        })
      )
    ).subscribe(histories => {
      this.history = histories;
    });
  }

  ngOnDestroy() {
    this.basketSubscription.unsubscribe();
    this.historySubscription.unsubscribe();
  }

  buyAll() {
    this.store.buyAllAndUpdateHistoryAndDishes();
  }

  buy(index: number) {
    this.store.buyAndUpdateHistoryAndDishes(index);
  }

  sumPriceOfBasket() {
    return this.basket?.map(entry => entry.amount * entry.price).reduce((acc, cur) => acc + cur, 0) ?? 0;
  }
}
