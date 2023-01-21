import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dish } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-manage-dishes',
  templateUrl: './manage-dishes.component.html',
  styleUrls: ['./manage-dishes.component.css']
})
export class ManageDishesComponent implements OnInit, OnDestroy{
  constructor(private store: StoreService,
    private router: Router) {}
  dishes: Dish[];
  dishesSubscription: Subscription;

  ngOnInit( ) {
    this.dishesSubscription = this.store.getStream('dishes').subscribe(dishes => {
      this.dishes = dishes;
    })
  }
  ngOnDestroy() {
    this.dishesSubscription.unsubscribe();
  }

  deleteDish(dish: Dish) {
    this.store.updateOrder(dish.id, 0);
    this.store.deleteDish(dish.id);
  }

  modifyDish(dish: Dish) {
    this.router.navigate(['newDish', dish.id])
  }

  addNewDish( ) {
    this.router.navigate(['newDish', -1])
  }
}
