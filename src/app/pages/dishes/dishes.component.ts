import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, combineLatest, map, BehaviorSubject } from 'rxjs';
import { Dish, DishOrder } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { FilterDishesPipe } from 'src/app/pipes/filter-dishes/filter-dishes.pipe';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit, OnDestroy {
  constructor(private store: StoreService) {}

  @ViewChild('pagination') pagination: PaginationComponent;

  public nrOfDishesInChart = 0;
  public dishes: Dish[];
  public dishesSubscription: Subscription;
  public filteredDishes$: Observable<Dish[]>;
  public orderAmount$: Observable<number>;
  public itemsPerPage: number = 6;
  public itemsPerPage$: BehaviorSubject<number> = new BehaviorSubject(6); 
  public currentPage: number = 0;
  private filterPipe = new FilterDishesPipe();


  ngOnInit() {
    this.changeItemsPerPage(window.innerWidth);
    this.dishesSubscription = this.store.getStream('dishes').subscribe((data) => {
      this.dishes = data;
    });
    this.filteredDishes$ = combineLatest([
      this.store.getStream('dishes'),
      this.store.getStream('ratings'),
      this.store.getStream('dishFilter'),
    ]).pipe(
      map(([dishes, ratings, dishFilter]) => {
        return this.filterPipe.transform(dishes, dishFilter, ratings);
      })
    );

    this.orderAmount$ = this.store
      .getStream('order')
      .pipe(
        map((order: DishOrder[]) =>
          order.reduce((acc, cur) => acc + cur.amount, 0)
        )
      );
  }

  ngOnDestroy() {
    this.dishesSubscription.unsubscribe();
  }

  isDishCheapest(dish: Dish) {
    return (
      dish.price ===
      this.dishes
        .map((x) => x.price)
        .reduce((min, cur) => (min < cur ? min : cur), Number.MAX_VALUE)
    );
  }

  isDishMostExpensive(dish: Dish) {
    return (
      dish.price ===
      this.dishes
        .map((x) => x.price)
        .reduce((max, cur) => (max > cur ? max : cur), Number.MIN_VALUE)
    );
  }

  resetPagination() {
    this.pagination.reset();
  }

  handlePageChange(event: number) {
    this.currentPage = event;
  }

  handlePageExceeded(event: number) {
    this.currentPage = event;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.changeItemsPerPage(window.innerWidth);
  }

  changeItemsPerPage(width: number) {
    if( width >= 2100) {
      this.itemsPerPage = 12
    } else if ( width >= 1420) {
      this.itemsPerPage = 8;
    } else {
      this.itemsPerPage = 4;
    }
    this.itemsPerPage$.next(this.itemsPerPage);
  }
}
