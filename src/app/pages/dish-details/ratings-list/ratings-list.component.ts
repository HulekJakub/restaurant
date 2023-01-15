import { Component, Input, OnInit } from '@angular/core';
import {
  Observable,
  map,
} from 'rxjs';
import { Rating } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';
import { Dish } from 'src/app/store/datatypes';


@Component({
  selector: 'app-ratings-list',
  templateUrl: './ratings-list.component.html',
  styleUrls: ['./ratings-list.component.css'],
})
export class RatingsListComponent implements OnInit {
  @Input('dishId') dishId: number;

  public dish: Dish;
  ratings$: Observable<Rating[]>;

  constructor(protected store: StoreService) {}

  ngOnInit() {
    this.ratings$ = this.store.getStream('ratings').pipe(
      map(ratings =>
        ratings.filter((rating: Rating) => rating.dishId === this.dishId)
      )
    );
  }

}
